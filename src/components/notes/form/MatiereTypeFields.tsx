import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { matieres, typesEvaluation } from './NoteFormSchema';
import { Input } from '@/components/ui/input';

interface MatiereTypeFieldsProps {
  form: any;
  selectedMatiere: string;
}

const MatiereTypeFields: React.FC<MatiereTypeFieldsProps> = ({ form, selectedMatiere }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="matiere"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Matière</FormLabel>
            <FormControl>
              <Input {...field} value={selectedMatiere} disabled />
            </FormControl>
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {typesEvaluation.map((type) => (
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
  );
};

export default MatiereTypeFields;
