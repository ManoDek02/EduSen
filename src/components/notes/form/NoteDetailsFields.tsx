
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NoteDetailsFieldsProps {
  form: any;
}

const NoteDetailsFields: React.FC<NoteDetailsFieldsProps> = ({ form }) => {
  return (
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
  );
};

export default NoteDetailsFields;
