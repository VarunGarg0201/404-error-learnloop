"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { Button } from "@/components/ui/button";
import {
  Code,
  Play,
  Copy,
  Check,
  Users,
  ChevronDown,
  Terminal,
  FileCode,
  Loader2,
  Share2,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Collaborative Coding — Phase 2
   ─────────────────────────────────────────────────────────
   A shared code editor for pair programming sessions.
   Uses a styled textarea with syntax-aware formatting.
   ═══════════════════════════════════════════════════════════ */

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", ext: "js" },
  { value: "typescript", label: "TypeScript", ext: "ts" },
  { value: "python", label: "Python", ext: "py" },
  { value: "java", label: "Java", ext: "java" },
  { value: "cpp", label: "C++", ext: "cpp" },
  { value: "rust", label: "Rust", ext: "rs" },
  { value: "go", label: "Go", ext: "go" },
  { value: "html", label: "HTML", ext: "html" },
  { value: "css", label: "CSS", ext: "css" },
  { value: "sql", label: "SQL", ext: "sql" },
];

const STARTER_CODE: Record<string, string> = {
  javascript: `// Welcome to LearnLoop Code Editor
// Start coding with your study partner!

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55`,
  typescript: `// TypeScript Collaborative Editor
interface Student {
  name: string;
  skills: string[];
  knowledgeCredits: number;
}

function matchStudents(a: Student, b: Student): number {
  const shared = a.skills.filter(s => b.skills.includes(s));
  return shared.length / Math.max(a.skills.length, b.skills.length);
}`,
  python: `# Python Collaborative Editor
# Start coding together!

def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

print(binary_search([1, 3, 5, 7, 9, 11], 7))  # 3`,
  java: `// Java Collaborative Editor
public class LearnLoop {
    public static void main(String[] args) {
        System.out.println("Hello from LearnLoop!");
    }

    public static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
}`,
  cpp: `// C++ Collaborative Editor
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int n : nums) sum += n;
    cout << "Sum: " << sum << endl;
    return 0;
}`,
  rust: `// Rust Collaborative Editor
fn main() {
    let nums = vec![1, 2, 3, 4, 5];
    let sum: i32 = nums.iter().sum();
    println!("Sum: {}", sum);
}`,
  go: `// Go Collaborative Editor
package main

import "fmt"

func main() {
    nums := []int{1, 2, 3, 4, 5}
    sum := 0
    for _, n := range nums {
        sum += n
    }
    fmt.Println("Sum:", sum)
}`,
  html: `<!-- HTML Collaborative Editor -->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>LearnLoop</title>
</head>
<body>
  <h1>Hello from LearnLoop!</h1>
  <p>Start building together.</p>
</body>
</html>`,
  css: `/* CSS Collaborative Editor */
.learnloop-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.learnloop-card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}`,
  sql: `-- SQL Collaborative Editor
SELECT 
  u.display_name,
  u.knowledge_credits,
  COUNT(rp.id) as total_sessions
FROM users u
LEFT JOIN room_participants rp ON u.id = rp.user_id
GROUP BY u.id
ORDER BY total_sessions DESC
LIMIT 10;`,
};

function OutputPanel({ output }: { output: string[] }) {
  return (
    <div className="bg-[#0d1117] rounded-lg border border-border/30 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/20 bg-[#161b22]">
        <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[11px] font-medium text-muted-foreground">Output</span>
      </div>
      <div className="p-3 font-mono text-[12px] text-green-400/90 min-h-[80px] max-h-[120px] overflow-y-auto">
        {output.length > 0 ? (
          output.map((line, i) => (
            <div key={i} className="leading-relaxed">
              <span className="text-muted-foreground/50 mr-2 select-none">{`>`}</span>
              {line}
            </div>
          ))
        ) : (
          <span className="text-muted-foreground/40">Run your code to see output here...</span>
        )}
      </div>
    </div>
  );
}

export default function CodeEditorPage() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(STARTER_CODE.javascript);
  const [output, setOutput] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineCount = code.split("\n").length;

  function handleLanguageChange(lang: string) {
    setLanguage(lang);
    setCode(STARTER_CODE[lang] || "// Start coding...");
    setOutput([]);
    setLangOpen(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRun() {
    setRunning(true);
    // Simulated execution for demo
    setTimeout(() => {
      const lines: string[] = [];
      if (language === "javascript" || language === "typescript") {
        lines.push("Compiling...", "✓ No errors found", "Output: Program executed successfully");
        // Try to detect console.log/print in the code
        const logs = code.match(/console\.log\((.*?)\)/g);
        if (logs) logs.forEach((l) => lines.push(`  ${l}`));
      } else if (language === "python") {
        lines.push("Running Python 3.11...", "✓ Execution complete");
        const prints = code.match(/print\((.*?)\)/g);
        if (prints) prints.forEach((p) => lines.push(`  ${p}`));
      } else {
        lines.push(`Compiling ${language}...`, "✓ Build successful", "✓ Program executed");
      }
      setOutput(lines);
      setRunning(false);
    }, 1200);
  }

  // Handle tab key for indentation
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      setCode(code.substring(0, start) + "  " + code.substring(end));
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  }

  return (
    <div className={cn("space-y-4", fullscreen && "fixed inset-0 z-50 bg-background p-4 overflow-y-auto")}>
      <PageHeader
        title="Collaborative Code"
        description="Write, share, and review code together in real-time."
      >
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" className="gap-1.5 text-xs" onClick={() => setFullscreen(!fullscreen)}>
            <Maximize2 className="w-3.5 h-3.5" />
            {fullscreen ? "Exit" : "Fullscreen"}
          </Button>
        </div>
      </PageHeader>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/60 bg-card hover:bg-accent/30 transition-all"
            >
              <FileCode className="w-3.5 h-3.5 text-primary" />
              {LANGUAGES.find((l) => l.value === language)?.label}
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
            {langOpen && (
              <div className="absolute top-full left-0 mt-1 z-20 bg-card border border-border/60 rounded-lg shadow-lg py-1 w-44">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => handleLanguageChange(l.value)}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-xs hover:bg-accent/40 transition-colors flex items-center justify-between",
                      language === l.value && "text-primary font-semibold"
                    )}
                  >
                    {l.label}
                    <span className="text-[10px] text-muted-foreground">.{l.ext}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Online indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success/10 border border-success/20">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-medium text-success">Live</span>
            <Users className="w-3 h-3 text-success/60" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" className="gap-1.5 text-xs" onClick={handleCopy}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button size="sm" className="gap-1.5 text-xs" onClick={handleRun} disabled={running}>
            {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            Run
          </Button>
        </div>
      </div>

      {/* Editor */}
      <SurfaceCard className="p-0 overflow-hidden">
        <div className="flex">
          {/* Line numbers */}
          <div className="flex flex-col items-end px-3 py-4 bg-[#0d1117] border-r border-border/20 select-none min-w-[40px]">
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i} className="text-[11px] font-mono text-muted-foreground/40 leading-[1.625rem]">
                {i + 1}
              </span>
            ))}
          </div>
          {/* Code area */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className={cn(
              "flex-1 bg-[#0d1117] text-[#e6edf3] font-mono text-[13px] leading-[1.625rem]",
              "p-4 outline-none resize-none min-h-[400px]",
              "placeholder:text-muted-foreground/30",
              fullscreen && "min-h-[60vh]"
            )}
            placeholder="Start coding..."
          />
        </div>
      </SurfaceCard>

      {/* Output */}
      <OutputPanel output={output} />
    </div>
  );
}
