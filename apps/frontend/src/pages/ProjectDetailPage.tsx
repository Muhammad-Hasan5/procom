import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router";
import {
  LayoutDashboard,
  ListTodo,
  FileText,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProject } from "@/lib/projects-api";
import type { Project } from "@/types/api";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { ProjectTasks } from "@/components/project/ProjectTasks";
import { ProjectNotes } from "@/components/project/ProjectNotes";
import { ProjectMembers } from "@/components/project/ProjectMembers";
import { cn } from "@/lib/utils";

type TabId = "overview" | "tasks" | "notes" | "members";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="size-4" />,
  },
  { id: "tasks", label: "Tasks", icon: <ListTodo className="size-4" /> },
  { id: "notes", label: "Notes", icon: <FileText className="size-4" /> },
  { id: "members", label: "Members", icon: <Users className="size-4" /> },
];

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const tabParam = searchParams.get("tab") as TabId;
  const initialTab =
    tabParam && TABS.some((t) => t.id === tabParam) ? tabParam : "overview";
  const [tab, setTab] = useState<TabId>(initialTab);

  useEffect(() => {
    if (!projectId) return;
    getProject(projectId)
      .then((p) => setProject(p ?? null))
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleTabChange = (newTab: TabId) => {
    setTab(newTab);
    setSearchParams({ tab: newTab });
  };

  if (loading || !projectId) {
    return (
      <div className="container flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-24 text-center">
        <p className="text-muted-foreground">Project not found.</p>
        <Link to="/projects">
          <Button variant="link">Back to projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/projects">
            <Button variant="ghost" size="icon" className="hover:bg-muted">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
        </div>

        <div className="mb-8 flex gap-1 border-b border-border/50 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTabChange(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 border-b-2 whitespace-nowrap",
                tab === t.id
                  ? "bg-muted/50 text-foreground border-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border-transparent",
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="min-h-400px">
          {tab === "overview" && (
            <ProjectOverview projectId={projectId} project={project} />
          )}
          {tab === "tasks" && (
            <ProjectTasks projectId={projectId} project={project} />
          )}
          {tab === "notes" && <ProjectNotes projectId={projectId} />}
          {tab === "members" && (
            <ProjectMembers projectId={projectId} project={project} />
          )}
        </div>
      </div>
    </div>
  );
}
