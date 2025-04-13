// 🔁 SUPPRESSION de l'import de `pool`
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FilePlus } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Bulletin } from '@/types/bulletin';
import { Eleve } from '@/types/eleve';
import { getEleves } from '@/services/elevesService';

interface NewBulletinDialogProps {
  onAddBulletin: (bulletin: Bulletin) => void;
}

const NewBulletinDialog = ({ onAddBulletin }: NewBulletinDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const form = useForm({
    defaultValues: {
      eleveId: '',
      semestre: '1',
      annee: '2023-2024'
    }
  });

  useEffect(() => {
    const fetchEleves = async () => {
      try {
        const fetchedEleves = await getEleves();
        setEleves(fetchedEleves);
      } catch (err) {
        toast.error("Erreur lors du chargement des élèves");
      }
    };

    fetchEleves();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      const res = await fetch('/api/bulletins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Erreur lors de la création du bulletin');
      }

      const newBulletin = await res.json();
      onAddBulletin(newBulletin);
      toast.success("Bulletin généré avec succès");
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Erreur inconnue");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FilePlus className="mr-2 h-4 w-4" />
          Nouveau bulletin
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau bulletin</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                      {eleves.map(eleve => (
                        <SelectItem key={eleve.id} value={eleve.id.toString()}>
                          {eleve.prenom} {eleve.nom} - {eleve.classe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="semestre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semestre</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un semestre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Semestre 1</SelectItem>
                      <SelectItem value="2">Semestre 2</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="annee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Année scolaire</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une année" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                      <SelectItem value="2022-2023">2022-2023</SelectItem>
                      <SelectItem value="2021-2022">2021-2022</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Générer le bulletin</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewBulletinDialog;
