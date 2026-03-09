import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Pin, Archive } from "lucide-react";
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
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  pinNote,
  archiveNote,
} from "@/lib/notes-api";
import type { Note } from "@/types/api";
import type { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

export function ProjectNotes({ projectId }: { projectId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState("");

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getNotes(projectId);
      setNotes(list ?? []);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  const openCreate = () => {
    setEditingNote(null);
    setFormTitle("");
    setFormContent("");
    setFormError(null);
    setActiveNoteId(null);
    setDialogOpen(true);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content ?? "");
    setFormError(null);
    setDialogOpen(true);
  };

  const openReader = (note: Note) => {
    setActiveNoteId(note._id);
    setActiveContent(note.content ?? "");
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
      if (editingNote) {
        await updateNote(projectId, editingNote._id, {
          title: formTitle.trim(),
          content: formContent,
        });
      } else {
        await createNote(projectId, {
          title: formTitle.trim(),
          content: formContent,
        });
      }
      setDialogOpen(false);
      void loadNotes();
      if (editingNote && activeNoteId === editingNote._id) {
        setActiveContent(formContent);
      }
    } catch (err) {
      setFormError((err as ApiError).message ?? "Failed to save note");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (note: Note) => {
    if (!confirm("Delete this note?")) return;
    try {
      await deleteNote(projectId, note._id);
      if (activeNoteId === note._id) setActiveNoteId(null);
      void loadNotes();
    } catch {
      // ignore
    }
  };

  const handlePin = async (note: Note) => {
    try {
      await pinNote(projectId, note._id);
      void loadNotes();
    } catch {
      // ignore
    }
  };

  const handleArchive = async (note: Note) => {
    try {
      await archiveNote(projectId, note._id);
      void loadNotes();
    } catch {
      // ignore
    }
  };

  const saveActiveContent = async () => {
    if (!activeNoteId) return;
    const note = notes.find((n) => n._id === activeNoteId);
    if (!note) return;
    try {
      await updateNote(projectId, note._id, { content: activeContent });
      void loadNotes();
    } catch {
      // ignore
    }
  };

  const activeNote = notes.find((n) => n._id === activeNoteId);

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="w-full lg:w-80 shrink-0 space-y-4">
        <div className="flex justify-end">
          <Button onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            New note
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : notes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No notes yet. Create one to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <Card
                key={note._id}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-muted/50",
                  activeNoteId === note._id && "ring-2 ring-primary"
                )}
                onClick={() => openReader(note)}
              >
                <CardHeader className="py-3 flex flex-row items-center justify-between gap-2">
                  <CardTitle className="text-sm font-medium line-clamp-1">
                    {note.title}
                  </CardTitle>
                  <div className="flex shrink-0 gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => openEdit(note)}
                      title="Edit"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handlePin(note)}
                      title="Pin"
                    >
                      <Pin className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleArchive(note)}
                      title="Archive"
                    >
                      <Archive className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDelete(note)}
                      title="Delete"
                      className="text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      {activeNote && (
        <Card className="flex-1 min-w-0">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle>{activeNote.title}</CardTitle>
            <Button size="sm" variant="outline" onClick={saveActiveContent}>
              Save
            </Button>
          </CardHeader>
          <CardContent>
            <textarea
              className="min-h-400px w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
              value={activeNoteId === activeNote._id ? activeContent : activeNote.content ?? ""}
              onChange={(e) => {
                if (activeNoteId === activeNote._id) setActiveContent(e.target.value);
              }}
              onBlur={saveActiveContent}
              placeholder="Write your note…"
            />
          </CardContent>
        </Card>
      )}

      {!activeNote && notes.length > 0 && (
        <Card className="flex-1 flex items-center justify-center min-h-200px">
          <CardContent className="text-center text-muted-foreground text-sm">
            Select a note to view and edit
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingNote ? "Edit note" : "New note"}
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
                placeholder="Note title"
                autoFocus
              />
            </Field>
            <Field>
              <FieldLabel>Content (optional)</FieldLabel>
              <Textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Content"
                rows={6}
              />
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
                {submitting ? "Saving…" : editingNote ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
