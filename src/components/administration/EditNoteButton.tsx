import { useState } from 'react';
import { Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface EditNoteButtonProps {
  noteId: string;
  currentNote: number;
  onUpdate: (noteId: string, newNote: number) => Promise<void>;
}

export const EditNoteButton = ({ noteId, currentNote, onUpdate }: EditNoteButtonProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(currentNote.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNote(currentNote.toString());
  };

  const handleSave = async () => {
    const newNote = parseFloat(note);
    
    if (isNaN(newNote) || newNote < 0 || newNote > 20) {
      toast.error("La note doit être comprise entre 0 et 20");
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate(noteId, newNote);
      setIsEditing(false);
      toast.success("Note mise à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la note");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-20"
          min="0"
          max="20"
          step="0.25"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          disabled={isLoading}
          className="text-green-600 hover:text-green-700"
        >
          <Check size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          disabled={isLoading}
          className="text-red-600 hover:text-red-700"
        >
          <X size={16} />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleEdit}
      className="text-blue-600 hover:text-blue-700"
    >
      <Edit2 size={16} />
    </Button>
  );
}; 