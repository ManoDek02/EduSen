
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FilePlus } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Bulletin } from '@/data/bulletinsMockData';
import { elevesMockData } from '@/data/elevesMockData';
import { notesMockData } from '@/data/notesMockData';

interface NewBulletinDialogProps {
  onAddBulletin: (bulletin: Bulletin) => void;
}

const NewBulletinDialog = ({ onAddBulletin }: NewBulletinDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const form = useForm({
    defaultValues: {
      eleveId: '',
      trimestre: '1',
      annee: '2023-2024'
    }
  });

  const handleSubmit = (data) => {
    // Trouver l'élève sélectionné
    const eleve = elevesMockData.find(e => e.id === data.eleveId);
    
    if (!eleve) {
      toast.error("Élève non trouvé");
      return;
    }

    // Récupérer les notes de l'élève pour le trimestre sélectionné
    const notesEleve = notesMockData.filter(
      n => n.eleveId === eleve.id && n.trimestre === parseInt(data.trimestre)
    );

    if (notesEleve.length === 0) {
      toast.error("Pas de notes disponibles pour cet élève ce trimestre");
      return;
    }

    // Calculer les moyennes par matière
    const matieresMap = new Map();
    notesEleve.forEach(note => {
      if (!matieresMap.has(note.matiere)) {
        matieresMap.set(note.matiere, {
          matiere: note.matiere,
          notes: [],
          coefficients: [],
          professeur: note.professeur
        });
      }
      matieresMap.get(note.matiere).notes.push(note.note);
      matieresMap.get(note.matiere).coefficients.push(note.coefficient);
    });

    // Créer le tableau de matières avec moyennes
    const matieres = Array.from(matieresMap.values()).map(m => {
      const sommeCoef = m.coefficients.reduce((acc, coef) => acc + coef, 0);
      const sommeNotes = m.notes.reduce((acc, note, idx) => acc + note * m.coefficients[idx], 0);
      const moyenne = sommeCoef > 0 ? sommeNotes / sommeCoef : 0;
      
      return {
        matiere: m.matiere,
        moyenne: moyenne,
        moyenneClasse: 12 + Math.random() * 2, // Valeur fictive
        appreciation: "À compléter",
        professeur: m.professeur
      };
    });

    // Calculer la moyenne générale
    const sommeTotale = matieres.reduce((acc, m) => acc + m.moyenne, 0);
    const moyenneGenerale = matieres.length > 0 ? sommeTotale / matieres.length : 0;

    // Créer le nouveau bulletin
    const newBulletin: Bulletin = {
      id: Math.random().toString(36).substring(2, 9),
      eleveId: eleve.id,
      eleveNom: eleve.nom,
      elevePrenom: eleve.prenom,
      classe: eleve.classe,
      trimestre: parseInt(data.trimestre),
      annee: data.annee,
      matieres: matieres,
      moyenneGenerale: moyenneGenerale,
      moyenneClasse: 12.5, // Valeur fictive
      appreciationGenerale: "À compléter par le professeur principal",
      status: 'brouillon'
    };

    onAddBulletin(newBulletin);
    setOpen(false);
    form.reset();
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un élève" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {elevesMockData.map(eleve => (
                        <SelectItem key={eleve.id} value={eleve.id}>
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
              name="trimestre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trimestre</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un trimestre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
              name="annee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Année scolaire</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
