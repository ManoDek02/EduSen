
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Professeur } from '@/types/professeur';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

interface NewProfesseurDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProfesseur: (professeur: Omit<Professeur, 'id'>) => void;
}

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
  "Philosophie"
];

const STATUS = ['Temps plein', 'Temps partiel', 'Vacataire'];

export const NewProfesseurDialog = ({ open, onOpenChange, onAddProfesseur }: NewProfesseurDialogProps) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    matiere: '',
    email: '',
    telephone: '',
    status: 'Temps plein' as const,
    user_id: 0,
    matricule: '',
    // Ajout des champs manquants selon le type Professeur
    classe: ''  // Ajout du champ obligatoire manquant
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.nom || !formData.prenom || !formData.matiere || !formData.email || !formData.telephone || formData.user_id <= 0 || !formData.matricule) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    // Validation téléphone (exemple simple)
    const phoneRegex = /^[0-9]{10}$/; // Ajustez selon le format attendu
    if (!phoneRegex.test(formData.telephone)) {
      toast.error('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    onAddProfesseur(formData);
    setFormData({
      nom: '',
      prenom: '',
      matiere: '',
      email: '',
      telephone: '',
      status: 'Temps plein',
      user_id: 0,
      matricule: '',
      classe: ''  // Réinitialisation du champ classe
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau professeur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </div>
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
            <Label htmlFor="classe">Classe</Label>
            <Input
              id="classe"
              value={formData.classe}
              onChange={(e) => setFormData({ ...formData, classe: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user_id">User ID</Label>
            <Input
              id="user_id"
              type="number"
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="matricule">Matricule</Label>
            <Input
              id="matricule"
              value={formData.matricule}
              onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as typeof formData.status })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                {STATUS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
