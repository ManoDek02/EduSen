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

// Import the smaller components
import EleveSelect from './form/EleveSelect';
import MatiereTypeFields from './form/MatiereTypeFields';
import NoteDetailsFields from './form/NoteDetailsFields';
import ProfesseurDateFields from './form/ProfesseurDateFields';
import CommentaireField from './form/CommentaireField';

interface NewNoteDialogProps {
  onAddNote: (note) => void;
  selectedClass: string;
  selectedMatiere: string;
}

const NewNoteDialog: React.FC<NewNoteDialogProps> = ({ onAddNote, selectedClass, selectedMatiere }) => {
  const [open, setOpen] = React.useState(false);
  
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      eleveId: '',
      matiere: selectedMatiere,
      note: 0,
      coefficient: 1,
      professeur: '',
      trimestre: 1,
      dateEvaluation: new Date().toISOString().split('T')[0],
      commentaire: '',
      type: '',
    },
  });

  React.useEffect(() => {
    if (selectedMatiere) {
      form.setValue('matiere', selectedMatiere);
    }
  }, [selectedMatiere, form]);

  const onSubmit = (data: NoteFormValues) => {
    const eleve = elevesMockData.find(e => e.id === data.eleveId);
    
    if (!eleve) {
      toast.error('Élève introuvable');
      return;
    }

    if (eleve.classe !== selectedClass) {
      toast.error('L\'élève n\'appartient pas à la classe sélectionnée');
      return;
    }

    const newNote = {
      id: Math.random().toString(36).substring(2, 9),
      eleveId: data.eleveId,
      eleveNom: eleve.nom,
      elevePrenom: eleve.prenom,
      classe: selectedClass,
      matiere: selectedMatiere,
      note: data.note,
      coefficient: data.coefficient,
      professeur: data.professeur,
      trimestre: data.trimestre,
      dateEvaluation: data.dateEvaluation,
      commentaire: data.commentaire || '',
      type: data.type,
    };

    onAddNote(newNote);
    toast.success('Note ajoutée avec succès');
    form.reset();
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle note</DialogTitle>
          <DialogDescription>
            Saisissez les informations de la note pour un élève de {selectedClass} en {selectedMatiere}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <EleveSelect form={form} selectedClass={selectedClass} />
            <MatiereTypeFields form={form} selectedMatiere={selectedMatiere} />
            <NoteDetailsFields form={form} />
            <ProfesseurDateFields form={form} />
            <CommentaireField form={form} />
            
            <DialogFooter>
              <Button type="submit">Ajouter la note</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewNoteDialog;
