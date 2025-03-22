
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface ProfesseurDateFieldsProps {
  form: any;
}

const ProfesseurDateFields: React.FC<ProfesseurDateFieldsProps> = ({ form }) => {
  return (
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
  );
};

export default ProfesseurDateFields;
