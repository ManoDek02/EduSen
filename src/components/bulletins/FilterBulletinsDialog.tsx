
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';

const classeOptions = [
  '6ème B',
  '5ème A',
  '4ème C',
  '3ème A',
  '2nde',
  '1ère ES',
  'Terminale S'
];

const statusOptions = [
  { id: 'brouillon', label: 'Brouillon' },
  { id: 'publié', label: 'Publié' },
  { id: 'archivé', label: 'Archivé' },
];

interface FilterBulletinsDialogProps {
  onApplyFilters: (filters: any) => void;
}

const FilterBulletinsDialog = ({ onApplyFilters }: FilterBulletinsDialogProps) => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      trimestre: '',
      classe: '',
      status: []
    }
  });

  const handleSubmit = (data) => {
    onApplyFilters({
      ...data,
      trimestre: data.trimestre ? parseInt(data.trimestre) : null
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtrer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtrer les bulletins</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="trimestre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trimestre</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les trimestres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les trimestres</SelectItem>
                      <SelectItem value="1">Trimestre 1</SelectItem>
                      <SelectItem value="2">Trimestre 2</SelectItem>
                      <SelectItem value="3">Trimestre 3</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les classes</SelectItem>
                      {classeOptions.map(classe => (
                        <SelectItem key={classe} value={classe}>
                          {classe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={() => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <div className="space-y-2">
                    {statusOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.id}
                          onCheckedChange={(checked) => {
                            const currentValues = form.getValues().status || [];
                            const newValues = checked
                              ? [...currentValues, option.id]
                              : currentValues.filter(v => v !== option.id);
                            form.setValue('status', newValues);
                          }}
                        />
                        <label htmlFor={option.id} className="text-sm">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset({
                    trimestre: '',
                    classe: '',
                    status: []
                  });
                  onApplyFilters({});
                }}
              >
                Réinitialiser
              </Button>
              <Button type="submit">Appliquer les filtres</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FilterBulletinsDialog;
