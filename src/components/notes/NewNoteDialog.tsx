
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { elevesMockData } from '@/data/elevesMockData';
import { Plus } from 'lucide-react';

// Schéma de validation pour le formulaire
const noteFormSchema = z.object({
  eleveId: z.string().min(1, { message: 'Veuillez sélectionner un élève' }),
  matiere: z.string().min(1, { message: 'Veuillez saisir une matière' }),
  note: z.coerce.number().min(0, { message: 'La note doit être positive' }).max(20, { message: 'La note ne peut pas dépasser 20' }),
  coefficient: z.coerce.number().min(1, { message: 'Le coefficient minimum est 1' }),
  professeur: z.string().min(1, { message: 'Veuillez saisir un professeur' }),
  trimestre: z.coerce.number().min(1, { message: 'Veuillez sélectionner un trimestre' }).max(3, { message: 'Trimestre invalide' }),
  dateEvaluation: z.string().min(1, { message: 'Veuillez saisir une date d\'évaluation' }),
  commentaire: z.string().optional(),
  type: z.string().min(1, { message: 'Veuillez sélectionner un type d\'évaluation' }),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

const matieres = [
  'Mathématiques', 'Français', 'Histoire-Géographie', 'Anglais', 'Espagnol', 
  'Allemand', 'Physique-Chimie', 'SVT', 'SES', 'NSI', 'Philosophie', 
  'EPS', 'Arts Plastiques', 'Musique'
];

const typesEvaluation = [
  'Contrôle', 'Devoir', 'Interrogation', 'TP', 'Exposé', 'Dissertation', 'Oral', 'Projet'
];

interface NewNoteDialogProps {
  onAddNote: (note) => void;
}

const NewNoteDialog: React.FC<NewNoteDialogProps> = ({ onAddNote }) => {
  const [open, setOpen] = React.useState(false);
  
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      eleveId: '',
      matiere: '',
      note: 0,
      coefficient: 1,
      professeur: '',
      trimestre: 1,
      dateEvaluation: new Date().toISOString().split('T')[0],
      commentaire: '',
      type: '',
    },
  });

  const onSubmit = (data: NoteFormValues) => {
    const eleve = elevesMockData.find(e => e.id === data.eleveId);
    
    if (!eleve) {
      toast.error('Élève introuvable');
      return;
    }

    const newNote = {
      id: Math.random().toString(36).substring(2, 9),
      eleveId: data.eleveId,
      eleveNom: eleve.nom,
      elevePrenom: eleve.prenom,
      classe: eleve.classe,
      matiere: data.matiere,
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
            Saisissez les informations de la note pour un élève
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="eleveId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Élève</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un élève" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {elevesMockData.map(eleve => (
                        <SelectItem key={eleve.id} value={eleve.id}>
                          {eleve.prenom} {eleve.nom} ({eleve.classe})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="matiere"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matière</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une matière" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {matieres.map(matiere => (
                          <SelectItem key={matiere} value={matiere}>
                            {matiere}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'évaluation</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typesEvaluation.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (/20)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" min="0" max="20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="coefficient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coefficient</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="trimestre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trimestre</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Trimestre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Trimestre 1</SelectItem>
                        <SelectItem value="2">Trimestre 2</SelectItem>
                        <SelectItem value="3">Trimestre 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="professeur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professeur</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dateEvaluation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'évaluation</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="commentaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
