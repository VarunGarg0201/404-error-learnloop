"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { InputField, TextareaField } from "@/components/shared/inputs";
import { UserAvatar } from "@/components/shared/user-avatar";
import { getProjects, createProject, joinProject } from "@/features/projects/actions";
import {
  Rocket,
  Plus,
  X,
  Loader2,
  Users,
  Code,
  Zap,
  Trophy,
  Lightbulb,
  UserPlus,
  Check,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Build Together / Projects Page
   ═══════════════════════════════════════════════════════════ */

type ProjectData = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  maxMembers: number;
  status: string;
  category: string;
  createdAt: string;
  creator: { displayName: string; avatarUrl: string | null };
  members: { id: string; userId: string; role: string }[];
};

const CATEGORY_META: Record<string, { icon: typeof Rocket; color: string; bg: string; label: string }> = {
  project: { icon: Code, color: "text-primary", bg: "bg-primary/10", label: "Project" },
  hackathon: { icon: Trophy, color: "text-warning", bg: "bg-warning/10", label: "Hackathon" },
  startup: { icon: Rocket, color: "text-success", bg: "bg-success/10", label: "Startup Idea" },
  practice: { icon: Lightbulb, color: "text-info", bg: "bg-info/10", label: "Practice" },
};

function ProjectCard({ project, onJoin }: { project: ProjectData; onJoin: (id: string) => void }) {
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const meta = CATEGORY_META[project.category] || CATEGORY_META.project;
  const Icon = meta.icon;
  const memberCount = project.members.length;
  const isFull = memberCount >= project.maxMembers;

  async function handleJoin() {
    setJoining(true);
    onJoin(project.id);
    setJoining(false);
    setJoined(true);
  }

  return (
    <SurfaceCard className="hover:border-border/60 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl shrink-0", meta.bg)}>
          <Icon className={cn("w-5 h-5", meta.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold truncate">{project.title}</h3>
            <span className={cn(
              "text-[9px] px-1.5 py-0.5 rounded-full font-medium capitalize",
              project.status === "recruiting" ? "bg-success/10 text-success" :
              project.status === "in-progress" ? "bg-warning/10 text-warning" :
              "bg-muted text-muted-foreground"
            )}>
              {project.status}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{project.description}</p>

          {/* Tech stack */}
          {project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/5 text-primary/80 border border-primary/10">
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <UserAvatar name={project.creator.displayName} src={project.creator.avatarUrl || undefined} size="xs" />
                <span>{project.creator.displayName}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Users className="w-3 h-3" />
                {memberCount}/{project.maxMembers}
              </div>
            </div>
            {project.status === "recruiting" && !isFull && (
              <Button
                size="xs"
                variant={joined ? "secondary" : "default"}
                disabled={joining || joined || isFull}
                onClick={handleJoin}
                className="gap-1"
              >
                {joining ? <Loader2 className="w-3 h-3 animate-spin" /> :
                 joined ? <><Check className="w-3 h-3" /> Joined</> :
                 <><UserPlus className="w-3 h-3" /> Join</>}
              </Button>
            )}
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", techStack: "", maxMembers: "4", category: "project",
  });

  async function load() {
    setLoading(true);
    const res = await getProjects();
    if (res.data) setProjects(res.data as any);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || submitting) return;
    setSubmitting(true);

    const res = await createProject({
      title: form.title.trim(),
      description: form.description.trim(),
      techStack: form.techStack.split(",").map((t) => t.trim()).filter(Boolean),
      maxMembers: Number(form.maxMembers) || 4,
      category: form.category,
    });

    if (res.success) {
      setForm({ title: "", description: "", techStack: "", maxMembers: "4", category: "project" });
      setComposing(false);
      await load();
    }
    setSubmitting(false);
  }

  async function handleJoin(projectId: string) {
    await joinProject(projectId);
    await load();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Build Together"
        description="Find teammates, collaborate on projects, hackathons, and startup ideas."
      >
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setComposing(!composing)}>
          {composing ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {composing ? "Cancel" : "New Project"}
        </Button>
      </PageHeader>

      {/* Compose */}
      {composing && (
        <SurfaceCard>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-wrap gap-2 mb-2">
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, category: key }))}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    form.category === key
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-card border-border/50 text-muted-foreground"
                  )}
                >
                  <meta.icon className="w-3 h-3" />
                  {meta.label}
                </button>
              ))}
            </div>
            <InputField label="Project Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. AI-Powered Note Taker" />
            <TextareaField label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What are you building? What skills do you need?" rows={3} />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Tech Stack (comma-separated)" value={form.techStack} onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value }))} placeholder="React, Node.js, Python" />
              <InputField label="Max Team Size" value={form.maxMembers} onChange={(e) => setForm((f) => ({ ...f, maxMembers: e.target.value }))} placeholder="4" type="number" />
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5">
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Create Project
              </Button>
            </div>
          </form>
        </SurfaceCard>
      )}

      {/* Project List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onJoin={handleJoin} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Rocket}
          title="No projects yet"
          description="Start the first project and find teammates who share your vision."
          action={
            <Button size="sm" variant="secondary" onClick={() => setComposing(true)} className="gap-1">
              <Plus className="w-3 h-3" />
              Create project
            </Button>
          }
        />
      )}
    </div>
  );
}
