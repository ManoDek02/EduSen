import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { elevesMockData } from '@/data/elevesMockData';

interface EleveSelectProps {
  form: any;
  selectedClass: string;
}

const EleveSelect: React.FC<EleveSelectProps> = ({ form, selectedClass }) => {
  const eleves = elevesMockData.filter(eleve => eleve.classe === selectedClass);

  return (
    <FormField
      control={form.control}
      name="eleveId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Élève</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un élève" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {eleves.map((eleve) => (
                <SelectItem key={eleve.id} value={eleve.id}>
                  {eleve.prenom} {eleve.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EleveSelect;
