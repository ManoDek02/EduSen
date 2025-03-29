import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const classes = [
  { id: '1', name: '6ème A' },
  { id: '2', name: '6ème B' },
  { id: '3', name: '5ème A' },
  { id: '4', name: '5ème B' },
  { id: '5', name: '4ème A' },
  { id: '6', name: '4ème B' },
  { id: '7', name: '3ème A' },
  { id: '8', name: '3ème B' },
  { id: '9', name: '2nde' },
  { id: '10', name: '1ère ES' },
  { id: '11', name: '1ère S' },
  { id: '12', name: 'Terminale ES' },
  { id: '13', name: 'Terminale S' },
];

const NewStudentDialog = ({ onAddStudent }) => {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    classe: '',
    responsable: '',
    email: '',
    telephone: '',
    adresse: '',
    status: 'Actif'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClasseChange = (value) => {
    setFormData(prev => ({ ...prev, classe: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.nom || !formData.prenom || !formData.dateNaissance || !formData.classe) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    // Génération d'un ID simple (dans une app réelle, ce serait géré par le backend)
    const newStudent = {
      ...formData,
      id: Math.floor(Math.random() * 10000).toString(),
    };

    // Ajouter l'élève à la liste
    onAddStudent(newStudent);
    
    // Notification de succès
    toast({
      title: "Élève ajouté",
      description: `${formData.prenom} ${formData.nom} a été ajouté avec succès.`,
    });
    
    // Réinitialiser le formulaire et fermer la modale
    setFormData({
      nom: '',
      prenom: '',
      dateNaissance: '',
      classe: '',
      responsable: '',
      email: '',
      telephone: '',
      adresse: '',
      status: 'Actif'
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvel élève
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel élève</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom <span className="text-red-500">*</span></Label>
              <Input 
                id="nom" 
                name="nom" 
                value={formData.nom} 
                onChange={handleChange} 
                placeholder="Nom de famille" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom <span className="text-red-500">*</span></Label>
              <Input 
                id="prenom" 
                name="prenom" 
                value={formData.prenom} 
                onChange={handleChange} 
                placeholder="Prénom" 
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateNaissance">Date de naissance <span className="text-red-500">*</span></Label>
              <Input 
                id="dateNaissance" 
                name="dateNaissance" 
                type="date" 
                value={formData.dateNaissance} 
                onChange={handleChange} 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classe">Classe <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.classe} 
                onValueChange={handleClasseChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(classe => (
                    <SelectItem key={classe.id} value={classe.name}>
                      {classe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsable">Responsable</Label>
            <Input 
              id="responsable" 
              name="responsable" 
              value={formData.responsable} 
              onChange={handleChange} 
              placeholder="Nom du responsable légal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Email du responsable"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input 
                id="telephone" 
                name="telephone" 
                value={formData.telephone} 
                onChange={handleChange} 
                placeholder="Téléphone du responsable"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input 
              id="adresse" 
              name="adresse" 
              value={formData.adresse} 
              onChange={handleChange} 
              placeholder="Adresse complète"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter l'élève</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewStudentDialog;
