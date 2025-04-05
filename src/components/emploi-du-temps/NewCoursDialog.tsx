import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

interface Cours {
  id: string;
  classe: string;
  matiere: string;
  professeur: string;
  salle: string;
  jour: number;
  debut: number;
  duree: number;
  couleur: string;
}

interface NewCoursDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCours: (cours: Omit<Cours, 'id' | 'couleur'>) => void;
}

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const HEURES = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
const MATIERES = [
  "Mathématiques",
  "Physique-Chimie",
  "SVT",
  "Histoire-Géographie",
  "Français",
  "Anglais",
  "Espagnol",
  "Allemand",
  "Arts Plastiques",
  "Musique",
  "EPS",
  "SES",
  "NSI",
  "Philosophie",
  "Informatique",
  "Mathématiques",
  "Physique-Chimie",
  "SVT",
  "Histoire-Géographie",
  "Français",
];

const CLASSES = ["3ème A", "3ème B", "4ème A", "4ème B"];
const SALLES = ["S-101", "S-102", "S-103", "S-104", "S-105", "S-201", "S-202", "S-203", "Labo-1", "Labo-2", "Gymnase"];

export const NewCoursDialog = ({ open, onOpenChange, onAddCours }: NewCoursDialogProps) => {
  const [formData, setFormData] = useState({
    classe: '',
    matiere: '',
    professeur: '',
    salle: '',
    jour: 0,
    debut: 0,
    duree: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.classe || !formData.matiere || !formData.professeur || !formData.salle || !formData.jour || !formData.debut || !formData.duree) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    onAddCours(formData);
    setFormData({
      classe: '',
      matiere: '',
      professeur: '',
      salle: '',
      jour: 0,
      debut: 0,
      duree: 1
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau cours</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="classe">Classe</Label>
            <Select
              value={formData.classe}
              onValueChange={(value) => setFormData({ ...formData, classe: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>
              <SelectContent>
                {CLASSES.map((classe) => (
                  <SelectItem key={classe} value={classe}>
                    {classe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="matiere">Matière</Label>
            <Select
              value={formData.matiere}
              onValueChange={(value) => setFormData({ ...formData, matiere: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une matière" />
              </SelectTrigger>
              <SelectContent>
                {MATIERES.map((matiere) => (
                  <SelectItem key={matiere} value={matiere}>
                    {matiere}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="professeur">Professeur</Label>
            <Input
              id="professeur"
              value={formData.professeur}
              onChange={(e) => setFormData({ ...formData, professeur: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salle">Salle</Label>
            <Select
              value={formData.salle}
              onValueChange={(value) => setFormData({ ...formData, salle: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une salle" />
              </SelectTrigger>
              <SelectContent>
                {SALLES.map((salle) => (
                  <SelectItem key={salle} value={salle}>
                    {salle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jour">Jour</Label>
              <Select
                value={formData.jour.toString()}
                onValueChange={(value) => setFormData({ ...formData, jour: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Jour" />
                </SelectTrigger>
                <SelectContent>
                  {JOURS.map((jour, index) => (
                    <SelectItem key={jour} value={index.toString()}>
                      {jour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="debut">Heure de début</Label>
              <Select
                value={formData.debut.toString()}
                onValueChange={(value) => setFormData({ ...formData, debut: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Heure" />
                </SelectTrigger>
                <SelectContent>
                  {HEURES.map((heure, index) => (
                    <SelectItem key={heure} value={index.toString()}>
                      {heure}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duree">Durée (heures)</Label>
              <Select
                value={formData.duree.toString()}
                onValueChange={(value) => setFormData({ ...formData, duree: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Durée" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3].map((duree) => (
                    <SelectItem key={duree} value={duree.toString()}>
                      {duree}h
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 