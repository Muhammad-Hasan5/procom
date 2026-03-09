import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { Plus, FolderKanban, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import { getProjects, createProject } from "@/lib/projects-api";
import type { Project } from "@/types/api";
import type { ApiError } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProjects(search || undefined);
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    if (!createTitle.trim()) {
      setCreateError("Title is required");
      return;
    }
    setCreateSubmitting(true);
    try {
      const created = await createProject({
        title: createTitle.trim(),
        description: createDescription.trim() || undefined,
      });
      setProjects((prev) => [created!, ...prev]);
      setCreateOpen(false);
      setCreateTitle("");
      setCreateDescription("");
    } catch (err) {
      setCreateError((err as ApiError).message ?? "Failed to create project");
    } finally {
      setCreateSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground text-base max-w-md">
              Create and manage your projects to organize tasks and notes
            </p>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            size="lg"
            className="gap-2 shadow-lg w-fit"
          >
            <Plus className="size-5" />
            New project
          </Button>
        </div>

        <div className="mb-8 flex flex-col gap-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 border-border/50 focus:border-primary/50"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="pt-0">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="rounded-full bg-muted p-6">
                <FolderKanban className="size-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No projects yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  Create your first project to start organizing tasks and notes.
                  Get started by clicking the button below.
                </p>
              </div>
              <Button
                onClick={() => setCreateOpen(true)}
                size="lg"
                className="gap-2"
              >
                <Plus className="size-5" />
                Create your first project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`}>
                <Card className="group overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-1 text-lg group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    {project.description && (
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {project.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Click to view details</span>
                      <div className="size-2 rounded-full bg-primary/60 group-hover:bg-primary transition-colors"></div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
            <DialogDescription>
              Add a new project to organize tasks and notes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <FieldGroup>
              {createError && (
                <Field>
                  <FieldError>{createError}</FieldError>
                </Field>
              )}
              <Field>
                <FieldLabel htmlFor="project-title">Title</FieldLabel>
                <Input
                  id="project-title"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="My project"
                  autoFocus
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="project-desc">
                  Description (optional)
                </FieldLabel>
                <Input
                  id="project-desc"
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  placeholder="Brief description"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createSubmitting}>
                {createSubmitting ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
