import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { noteFormSchema, NoteFormValues } from './NoteFormSchema';
import EleveSelect from './EleveSelect';
import MatiereTypeFields from './MatiereTypeFields';
import NoteDetailsFields from './NoteDetailsFields';
import ProfesseurDateFields from './ProfesseurDateFields';
import CommentaireField from './CommentaireField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NoteFormProps {
  onSubmit: (values: NoteFormValues) => void;
  selectedClass: string;
  selectedMatiere: string;
  matieresDisponibles: string[];
}

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, selectedClass, selectedMatiere, matieresDisponibles }) => {
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      eleveId: '',
      matiere: selectedMatiere,
      note: 0,
      coefficient: 1,
      professeur: '',
      semestre: 1,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <EleveSelect form={form} selectedClass={selectedClass} />
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Matière</label>
          <Select
            value={form.watch('matiere')}
            onValueChange={(value) => form.setValue('matiere', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une matière" />
            </SelectTrigger>
            <SelectContent>
              {matieresDisponibles.map((matiere) => (
                <SelectItem key={matiere} value={matiere}>
                  {matiere}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <MatiereTypeFields form={form} selectedMatiere={form.watch('matiere')} />
        <NoteDetailsFields form={form} />
        <ProfesseurDateFields form={form} />
        <CommentaireField form={form} />
        
        <DialogFooter>
          <Button type="submit">Ajouter la note</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default NoteForm; 