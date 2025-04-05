import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FilePlus } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Bulletin, BulletinMatiere } from '@/types/bulletin';
import { Eleve } from '@/types/eleve';
import { Note } from '@/types/note';
import pool from '@/config/database';
import { getEleves } from '@/services/elevesService';
import { getNotes } from '@/services/notesService';

interface NewBulletinDialogProps {
  onAddBulletin: (bulletin: Bulletin) => void;
}

const NewBulletinDialog = ({ onAddBulletin }: NewBulletinDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const form = useForm({
    defaultValues: {
      eleveId: '',
      semestre: '1',
      annee: '2023-2024'
    }
  });

  useEffect(() => {
    const fetchEleves = async () => {
      const fetchedEleves = await getEleves();
      setEleves(fetchedEleves);
    };

    fetchEleves();
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    };

    fetchNotes();
  }, []);
  const handleSubmit = async (data) => {
    // Trouver l'élève sélectionné
    const [result] = await pool.query('SELECT * FROM eleves WHERE id = ?', [data.eleveId]);
    const eleve = result[0];
    
    if (!eleve) {
      toast.error("Élève non trouvé");
      return;
    }

    // Récupérer les notes de l'élève pour le trimestre sélectionné
    const [notesResult] = await pool.query('SELECT * FROM notes WHERE eleve_id = ? AND semestre = ?', [eleve.id, data.semestre]);
    const notesEleve = notesResult as Note[];

    if (!notesEleve || notesEleve.length === 0) {
      toast.error("Pas de notes disponibles pour cet élève ce semestre");
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
      matieresMap.get(note.matiere).notes.push(note.note_1);
      matieresMap.get(note.matiere).notes.push(note.note_2);
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
      id: Math.floor(Math.random() * 1000000),
      eleveId: eleve.id,
      eleveNom: eleve.nom,
      elevePrenom: eleve.prenom,
      classe: eleve.classe,
      semestre: parseInt(data.semestre),
      annee: data.annee,
      matieres: matieres as BulletinMatiere[],
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
