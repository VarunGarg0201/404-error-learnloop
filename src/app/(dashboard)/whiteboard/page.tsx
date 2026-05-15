"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Eraser,
  Square,
  Circle,
  Minus,
  Type,
  Undo2,
  Trash2,
  Download,
  Palette,
  MousePointer,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Whiteboard — Phase 2
   ─────────────────────────────────────────────────────────
   Canvas-based drawing tool for visual collaboration.
   ═══════════════════════════════════════════════════════════ */

type Tool = "pen" | "eraser" | "line" | "rect" | "circle" | "select";
type DrawAction = {
  type: Tool;
  points: { x: number; y: number }[];
  color: string;
  width: number;
};

const COLORS = [
  "#e6edf3", "#f97583", "#79c0ff", "#56d364", "#d2a8ff",
  "#ffa657", "#ff7b72", "#7ee787", "#a5d6ff", "#f778ba",
];

const TOOLS: { value: Tool; icon: typeof Pencil; label: string }[] = [
  { value: "pen", icon: Pencil, label: "Pen" },
  { value: "eraser", icon: Eraser, label: "Eraser" },
  { value: "line", icon: Minus, label: "Line" },
  { value: "rect", icon: Square, label: "Rectangle" },
  { value: "circle", icon: Circle, label: "Circle" },
];

const SIZES = [2, 4, 6, 10];

export default function WhiteboardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#e6edf3");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<DrawAction[]>([]);
  const [currentAction, setCurrentAction] = useState<DrawAction | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 500 });

  // Set canvas size on mount
  useEffect(() => {
    const container = canvasRef.current?.parentElement;
    if (container) {
      setCanvasSize({ w: container.clientWidth, h: Math.max(500, window.innerHeight - 280) });
    }
    const handleResize = () => {
      if (container) {
        setCanvasSize({ w: container.clientWidth, h: Math.max(500, window.innerHeight - 280) });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redraw canvas whenever history or current action changes
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Draw all actions
    [...history, ...(currentAction ? [currentAction] : [])].forEach((action) => {
      if (!action.points.length) return;
      ctx.strokeStyle = action.type === "eraser" ? "#0d1117" : action.color;
      ctx.lineWidth = action.type === "eraser" ? action.width * 4 : action.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (action.type === "pen" || action.type === "eraser") {
        ctx.beginPath();
        ctx.moveTo(action.points[0].x, action.points[0].y);
        for (let i = 1; i < action.points.length; i++) {
          ctx.lineTo(action.points[i].x, action.points[i].y);
        }
        ctx.stroke();
      } else if (action.type === "line" && action.points.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(action.points[0].x, action.points[0].y);
        const last = action.points[action.points.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      } else if (action.type === "rect" && action.points.length >= 2) {
        const start = action.points[0];
        const end = action.points[action.points.length - 1];
        ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
      } else if (action.type === "circle" && action.points.length >= 2) {
        const start = action.points[0];
        const end = action.points[action.points.length - 1];
        const rx = Math.abs(end.x - start.x) / 2;
        const ry = Math.abs(end.y - start.y) / 2;
        const cx = start.x + (end.x - start.x) / 2;
        const cy = start.y + (end.y - start.y) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }, [history, currentAction]);

  useEffect(() => { redraw(); }, [redraw]);

  function getPos(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    setIsDrawing(true);
    const pos = getPos(e);
    setCurrentAction({ type: tool, points: [pos], color, width: strokeWidth });
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing || !currentAction) return;
    const pos = getPos(e);
    if (tool === "pen" || tool === "eraser") {
      setCurrentAction({ ...currentAction, points: [...currentAction.points, pos] });
    } else {
      // For shapes, only keep start + current
      setCurrentAction({ ...currentAction, points: [currentAction.points[0], pos] });
    }
  }

  function handleMouseUp() {
    if (currentAction && currentAction.points.length > 0) {
      setHistory([...history, currentAction]);
    }
    setCurrentAction(null);
    setIsDrawing(false);
  }

  function handleUndo() {
    setHistory(history.slice(0, -1));
  }

  function handleClear() {
    setHistory([]);
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "learnloop-whiteboard.png";
    link.href = canvas.toDataURL();
    link.click();
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Whiteboard"
        description="Draw, diagram, and collaborate visually."
      >
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" className="gap-1.5 text-xs" onClick={handleUndo} disabled={history.length === 0}>
            <Undo2 className="w-3.5 h-3.5" />
            Undo
          </Button>
          <Button size="sm" variant="secondary" className="gap-1.5 text-xs" onClick={handleDownload}>
            <Download className="w-3.5 h-3.5" />
            Save
          </Button>
          <Button size="sm" variant="destructive" className="gap-1.5 text-xs" onClick={handleClear} disabled={history.length === 0}>
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </Button>
        </div>
      </PageHeader>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Tools */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-card border border-border/50">
          {TOOLS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTool(t.value)}
              title={t.label}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-md transition-all",
                tool === t.value
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
              )}
            >
              <t.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-card border border-border/50">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "w-6 h-6 rounded-full border-2 transition-all",
                color === c ? "border-primary scale-110" : "border-transparent hover:scale-105"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Stroke width */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-card border border-border/50">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setStrokeWidth(s)}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-md transition-all",
                strokeWidth === s
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent/40"
              )}
            >
              <div className="rounded-full bg-current" style={{ width: s + 2, height: s + 2 }} />
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <SurfaceCard className="p-0 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={canvasSize.w}
          height={canvasSize.h}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="bg-[#0d1117] cursor-crosshair w-full block"
          style={{ height: canvasSize.h }}
        />
      </SurfaceCard>
    </div>
  );
}
