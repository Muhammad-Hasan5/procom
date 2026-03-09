import { useState, useEffect, useCallback } from "react";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  getProjectTasksList,
  createTask,
  updateTask,
  changeTaskStatus,
  deleteTask,
} from "@/lib/tasks-api";
import type { Project, Task, TaskStatus } from "@/types/api";
import type { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

const STATUSES: TaskStatus[] = ["todo", "in-progress", "review", "done"];
const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  review: "Review",
  done: "Done",
};

function getAssignedName(task: Task): string {
  const a = task.assignedTo;
  if (!a) return "Unassigned";
  if (typeof a === "object" && a !== null && "fullname" in a) return (a as { fullname?: string }).fullname ?? (a as { email?: string }).email ?? "—";
  return "—";
}

export function ProjectTasks({
  projectId,
}: {
  projectId: string;
  project: Project;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<TaskStatus>("todo");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getProjectTasksList(projectId);
      setTasks(list ?? []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const openCreate = () => {
    setEditingTask(null);
    setFormTitle("");
    setFormDescription("");
    setFormStatus("todo");
    setFormError(null);
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description ?? "");
    setFormStatus(task.status);
    setFormError(null);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formTitle.trim()) {
      setFormError("Title is required");
      return;
    }
    setSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(projectId, editingTask._id, {
          title: formTitle.trim(),
          description: formDescription.trim() || undefined,
          status: formStatus,
        });
      } else {
        await createTask(projectId, {
          title: formTitle.trim(),
          description: formDescription.trim() || undefined,
          status: formStatus,
        });
      }
      setDialogOpen(false);
      void loadTasks();
    } catch (err) {
      setFormError((err as ApiError).message ?? "Failed to save task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    try {
      await changeTaskStatus(projectId, task._id, newStatus);
      void loadTasks();
    } catch {
      // ignore
    }
  };

  const handleDelete = async (task: Task) => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTask(projectId, task._id);
      void loadTasks();
    } catch {
      // ignore
    }
  };

  const byStatus = STATUSES.map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          Add task
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {byStatus.map(({ status, tasks: colTasks }) => (
            <Card key={status} className="flex flex-col">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {STATUS_LABELS[status]}
                  <span className="text-muted-foreground font-normal">
                    {colTasks.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pt-0 space-y-2">
                {colTasks.map((task) => (
                  <div
                    key={task._id}
                    className={cn(
                      "rounded-lg border border-border bg-card p-3 text-sm transition-colors hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium line-clamp-2">{task.title}</p>
                        {task.description && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {getAssignedName(task)}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon-xs">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(task)}>
                            <Pencil className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(task)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {STATUSES.filter((s) => s !== task.status).map((s) => (
                        <Button
                          key={s}
                          variant="ghost"
                          size="xs"
                          className="text-xs"
                          onClick={() => handleStatusChange(task, s)}
                        >
                          → {STATUS_LABELS[s]}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit task" : "New task"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            {formError && (
              <Field>
                <FieldError>{formError}</FieldError>
              </Field>
            )}
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Task title"
                autoFocus
              />
            </Field>
            <Field>
              <FieldLabel>Description (optional)</FieldLabel>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Description"
                rows={2}
              />
            </Field>
            <Field>
              <FieldLabel>Status</FieldLabel>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </Field>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving…" : editingTask ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
