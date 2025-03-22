
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { elevesMockData } from '@/data/elevesMockData';

interface EleveSelectProps {
  form: any;
}

const EleveSelect: React.FC<EleveSelectProps> = ({ form }) => {
  return (
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
  );
};

export default EleveSelect;
