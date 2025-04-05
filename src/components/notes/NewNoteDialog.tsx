import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { noteFormSchema, NoteFormValues } from './form/NoteFormSchema';
import { elevesMockData } from '@/data/elevesMockData';
import type { Note } from '@/types/note';

// Import the smaller components
import EleveSelect from './form/EleveSelect';
import MatiereTypeFields from './form/MatiereTypeFields';
import NoteDetailsFields from './form/NoteDetailsFields';
import ProfesseurDateFields from './form/ProfesseurDateFields';
import CommentaireField from './form/CommentaireField';
import NoteForm from './form/NoteForm';

interface NewNoteDialogProps {
  onAddNote: (note: Note) => void;
  selectedClass: string;
  selectedMatiere: string;
  matieresDisponibles: string[];
}

const NewNoteDialog: React.FC<NewNoteDialogProps> = ({ onAddNote, selectedClass, selectedMatiere, matieresDisponibles }) => {
  const [open, setOpen] = React.useState(false);
  
  const handleSubmit = (values: NoteFormValues) => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      eleveId: parseInt(values.eleveId || '0'),
      eleveNom: elevesMockData.find(e => e.id === values.eleveId)?.nom || '',
      elevePrenom: elevesMockData.find(e => e.id === values.eleveId)?.prenom || '',
      classe: selectedClass,
      matiere: values.matiere,
      note_1: values.note_1,
      note_2: values.note_2,
      coefficient: values.coefficient,
      professeur: "Mme Dubois", // À remplacer par le nom du professeur connecté
      semestre: values.semestre,
      dateEvaluation: values.dateEvaluation,
      commentaire: values.commentaire,
      type: values.type
    };
    
    onAddNote(newNote);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle note</DialogTitle>
        </DialogHeader>
        <NoteForm 
          onSubmit={handleSubmit}
          selectedClass={selectedClass}
          selectedMatiere={selectedMatiere}
          matieresDisponibles={matieresDisponibles}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewNoteDialog;
