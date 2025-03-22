
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface CommentaireFieldProps {
  form: any;
}

const CommentaireField: React.FC<CommentaireFieldProps> = ({ form }) => {
  return (
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
  );
};

export default CommentaireField;
