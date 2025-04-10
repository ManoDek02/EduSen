import { useState } from 'react';
import { Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface EditNoteButtonProps {
  noteId: string;
  currentNote_1: number;
  currentNote_2: number;
  onUpdate: (noteId: string, newNote: number) => Promise<void>;
}

export const EditNoteButton = ({ noteId, currentNote_1, currentNote_2, onUpdate }: EditNoteButtonProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note_1, setNote_1] = useState(currentNote_1.toString());
  const [note_2, setNote_2] = useState(currentNote_2.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNote_1(currentNote_1.toString());
    setNote_2(currentNote_2.toString());
  };

  const handleSave = async () => {
    const newNote_1 = parseFloat(note_1);
    
    if (isNaN(newNote_1) || newNote_1 < 0 || newNote_1 > 20) {
      toast.error("La note 1 doit être comprise entre 0 et 20");
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate(noteId, newNote_1);
      setIsEditing(false);
      toast.success("Note mise à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la note");
      console.error(error);
    } finally {
      setIsLoading(false);
    }

    const newNote_2 = parseFloat(note_2);
    
    if (isNaN(newNote_2) || newNote_2 < 0 || newNote_2 > 20) {
      toast.error("La note 2 doit être comprise entre 0 et 20");
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate(noteId, newNote_2);
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
          value={note_1}
          onChange={(e) => setNote_1(e.target.value)}
          className="w-20"
          min="0"
          max="20"
          step="0.25"
        />
        <Input
          type="number"
          value={note_2}
          onChange={(e) => setNote_2(e.target.value)}
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