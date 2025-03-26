import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Note {
  id: string;
  eleveId: string;
  eleveNom: string;
  elevePrenom: string;
  classe: string;
  matiere: string;
  note: number;
  coefficient: number;
  professeur: string;
  trimestre: number;
  dateEvaluation: string;
  commentaire: string;
  type: string;
}

interface EditNoteDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (note: Note) => Promise<void>;
}

export const EditNoteDialog = ({ note, open, onOpenChange, onSave }: EditNoteDialogProps) => {
  const [editedNote, setEditedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mettre à jour editedNote quand note change
  useEffect(() => {
    if (note) {
      setEditedNote({ ...note });
    }
  }, [note]);

  const handleSave = async () => {
    if (!editedNote) return;

    try {
      setIsLoading(true);
      await onSave(editedNote);
      onOpenChange(false);
      toast.success("Note mise à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la note");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!editedNote) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Élève</Label>
            <div className="text-sm text-gray-500">
              {editedNote.elevePrenom} {editedNote.eleveNom}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Matière</Label>
            <div className="text-sm text-gray-500">{editedNote.matiere}</div>
          </div>
          <div className="space-y-2">
            <Label>Note</Label>
            <Input
              type="number"
              value={editedNote.note}
              onChange={(e) => setEditedNote({ ...editedNote, note: parseFloat(e.target.value) })}
              min="0"
              max="20"
              step="0.25"
            />
          </div>
          <div className="space-y-2">
            <Label>Commentaire</Label>
            <Input
              value={editedNote.commentaire}
              onChange={(e) => setEditedNote({ ...editedNote, commentaire: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 