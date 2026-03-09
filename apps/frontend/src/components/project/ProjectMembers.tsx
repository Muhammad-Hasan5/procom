import { useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
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
import { addMember, removeMember } from "@/lib/projects-api";
import type { Project, User } from "@/types/api";
import type { ApiError } from "@/lib/api";

function isUser(obj: unknown): obj is User {
  return typeof obj === "object" && obj !== null && "email" in obj;
}

export function ProjectMembers({
  projectId,
  project,
}: {
  projectId: string;
  project: Project;
}) {
  const currentUser = useAppSelector((s) => s.auth.user);
  const [addOpen, setAddOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const owner = project.owner;
  const ownerUser = typeof owner === "object" && owner !== null ? owner : null;
  const ownerId = ownerUser ? (owner as User)._id : (owner as string);
  const members = project.members ?? [];
  const memberUsers = members.map((m) =>
    typeof m === "object" && m !== null && isUser(m) ? m : null
  ).filter(Boolean) as User[];
  const isOwner = currentUser?._id === ownerId;

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    const email = memberEmail.trim();
    if (!email) {
      setAddError("Email is required");
      return;
    }
    setSubmitting(true);
    try {
      await addMember(projectId, email);
      setAddOpen(false);
      setMemberEmail("");
      setAddError(null);
      window.location.reload(); // refresh to get updated project
    } catch (err) {
      setAddError((err as ApiError).message ?? "Failed to add member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (member: User) => {
    if (!confirm(`Remove ${member.email} from the project?`)) return;
    try {
      await removeMember(projectId, member._id, member.email);
      window.location.reload();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {isOwner && (
        <div className="flex justify-end">
          <Button onClick={() => setAddOpen(true)}>Add member</Button>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Owner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="font-medium">
                {ownerUser
                  ? (ownerUser as User).fullname ?? (ownerUser as User).email
                  : "—"}
              </p>
              <p className="text-sm text-muted-foreground">
                {ownerUser ? (ownerUser as User).email : "—"}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">Owner</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Members ({memberUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {memberUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No other members. Only the owner can add members.
            </p>
          ) : (
            <ul className="space-y-2">
              {memberUsers.map((member) => (
                <li
                  key={member._id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="font-medium">{member.fullname ?? member.email}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleRemove(member)}
                    >
                      Remove
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add member</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Enter the email of the user to add. They must have an account.
            </p>
          </DialogHeader>
          <form onSubmit={handleAddMember}>
            {addError && (
              <Field>
                <FieldError>{addError}</FieldError>
              </Field>
            )}
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="colleague@example.com"
                autoFocus
              />
            </Field>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Adding…" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
