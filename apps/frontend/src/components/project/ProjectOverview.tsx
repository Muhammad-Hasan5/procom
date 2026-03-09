import { useState, useEffect } from "react";
import { Link } from "react-router";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, ListTodo } from "lucide-react";
import type { Project } from "@/types/api";

interface OverviewData {
  project: Project;
  projectMembers?: { _id: string; fullname?: string; email?: string }[];
  taskSummary?: { _id: string; count: number }[];
  recentNotes?: { _id: string; title: string; createdAt?: string }[];
}

export function ProjectOverview({
  projectId,
}: {
  projectId: string;
  project: Project;
}) {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<OverviewData>(`/api/v1/projects/${projectId}/overview`)
      .then((res) => setData(res.data ?? null))
      .catch((err) => {
        console.error("Failed to load project overview:", err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Failed to load project overview.
        </p>
      </div>
    );
  }

  const members = Array.isArray(data?.projectMembers)
    ? data.projectMembers
    : [];
  const taskSummary = Array.isArray(data?.taskSummary)
    ? data.taskSummary
    : data?.taskSummary && typeof data.taskSummary === "object"
      ? Object.entries(data.taskSummary).map(([key, value]) => ({
          _id: key,
          count: value as number,
        }))
      : [];
  const recentNotes = Array.isArray(data?.recentNotes) ? data.recentNotes : [];

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="size-5 rounded bg-primary/10 flex items-center justify-center">
              <ListTodo className="size-3 text-primary" />
            </div>
            Task Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {taskSummary.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                <ListTodo className="size-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No tasks yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {taskSummary.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <span className="font-medium capitalize text-sm">
                    {s._id}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {s.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="size-5 rounded bg-primary/10 flex items-center justify-center">
              <FileText className="size-3 text-primary" />
            </div>
            Recent Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                <FileText className="size-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No notes yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentNotes.map((n) => (
                <Link
                  key={n._id}
                  to={`/projects/${projectId}?tab=notes`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="size-8 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FileText className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {n.title}
                    </p>
                    {n.createdAt && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2 border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="size-5 rounded bg-primary/10 flex items-center justify-center">
              <Users className="size-3 text-primary" />
            </div>
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Team Size</p>
                <p className="text-sm text-muted-foreground">
                  Owner + {members.length} member
                  {members.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Navigate to members tab
                const url = new URL(window.location.href);
                url.searchParams.set("tab", "members");
                window.history.pushState({}, "", url.toString());
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
