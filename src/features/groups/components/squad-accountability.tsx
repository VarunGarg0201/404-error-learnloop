"use client";

import { useState } from "react";
import { SurfaceCard } from "@/components/shared/cards";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/shared/inputs";
import { Target, Flame, CheckCircle2, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SquadGoal } from "@/types";

/* ═══════════════════════════════════════════════════════════
   Squad Accountability Widget
   ─────────────────────────────────────────────────────────
   Tracks shared group goals, streaks, and check-ins.
   ═══════════════════════════════════════════════════════════ */

interface SquadAccountabilityProps {
  goals: SquadGoal[];
  streakDays: number;
}

export function SquadAccountability({ goals: initialGoals, streakDays }: SquadAccountabilityProps) {
  const [goals, setGoals] = useState<SquadGoal[]>(initialGoals);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget) return;

    const goal: SquadGoal = {
      id: crypto.randomUUID(),
      title: newTitle,
      targetHours: Number(newTarget),
      currentHours: 0,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 days
      isCompleted: false,
    };

    setGoals([goal, ...goals]);
    setNewTitle("");
    setNewTarget("");
    setIsAdding(false);
  };

  const handleLogHours = (id: string, hoursToAdd: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const newCurrent = g.currentHours + hoursToAdd;
      return {
        ...g,
        currentHours: newCurrent,
        isCompleted: newCurrent >= g.targetHours,
      };
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <SurfaceCard className="p-4 flex items-center gap-4 bg-warning/5 border-warning/20">
          <div className="p-2.5 rounded-full bg-warning/20 text-warning">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-warning">{streakDays}</p>
            <p className="text-[10px] font-semibold text-warning/80 uppercase tracking-wider">Day Streak</p>
          </div>
        </SurfaceCard>
        
        <SurfaceCard className="p-4 flex items-center gap-4 bg-success/5 border-success/20">
          <div className="p-2.5 rounded-full bg-success/20 text-success">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-success">{goals.filter(g => g.isCompleted).length}</p>
            <p className="text-[10px] font-semibold text-success/80 uppercase tracking-wider">Goals Met</p>
          </div>
        </SurfaceCard>
      </div>

      {/* Goals List */}
      <SurfaceCard>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Active Goals
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Shared targets for the squad.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsAdding(!isAdding)}>
            <Plus className="w-4 h-4 mr-1.5" /> New Goal
          </Button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddGoal} className="mb-6 p-4 rounded-xl border bg-muted/20 space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex gap-3">
              <InputField
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Master React Hooks"
                className="flex-1"
                required
              />
              <InputField
                type="number"
                min="1"
                value={newTarget}
                onChange={e => setNewTarget(e.target.value)}
                placeholder="Target Hours"
                className="w-32"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit" size="sm">Add</Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">No active goals.</p>
            </div>
          ) : (
            goals.map(goal => {
              const progress = Math.min(100, Math.round((goal.currentHours / goal.targetHours) * 100));
              const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

              return (
                <div key={goal.id} className={cn("p-4 rounded-xl border transition-colors", goal.isCompleted ? "bg-success/5 border-success/30" : "bg-card")}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className={cn("font-medium", goal.isCompleted && "text-success line-through opacity-80")}>{goal.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" /> {goal.currentHours} / {goal.targetHours} hrs
                        </span>
                        {!goal.isCompleted && (
                          <span className="flex items-center gap-1 text-warning">
                            <Clock className="w-3 h-3" /> {daysLeft} days left
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {!goal.isCompleted && (
                      <Button size="sm" variant="secondary" onClick={() => handleLogHours(goal.id, 1)}>
                        +1 Hour
                      </Button>
                    )}
                  </div>

                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500", goal.isCompleted ? "bg-success" : "bg-primary")}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SurfaceCard>
    </div>
  );
}
