import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusCircle, Download, Mail, Phone } from 'lucide-react';
import DataTable from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { NewProfesseurDialog } from '@/components/professeurs/NewProfesseurDialog';
import { EditProfesseurDialog } from '@/components/professeurs/EditProfesseurDialog';
import { ProfesseurDetailsDialog } from '@/components/professeurs/ProfesseurDetailsDialog';

interface Professeur {
  id: string;
  nom: string;
  prenom: string;
  matiere: string;
  email: string;
  telephone: string;
  status: 'Temps plein' | 'Temps partiel' | 'Vacataire';
}

// Exemple de données pour les professeurs
const professeursMockData: Professeur[] = [
  {
    id: '1',
    nom: 'Dubois',
    prenom: 'Marie',
    matiere: 'Mathématiques',
    email: 'm.dubois@edumanager.fr',
    telephone: '06 XX XX XX XX',
    status: 'Temps plein'
  },
  {
    id: '2',
    nom: 'Martin',
    prenom: 'Thomas',
    matiere: 'Histoire-Géographie',
    email: 't.martin@edumanager.fr',
    telephone: '06 XX XX XX XX',
    status: 'Temps plein'
  },
  {
    id: '3',
    nom: 'Bernard',
    prenom: 'Julie',
    matiere: 'Français',
    email: 'j.bernard@edumanager.fr',
    telephone: '06 XX XX XX XX',
    status: 'Temps partiel'
  },
  {
    id: '4',
    nom: 'Petit',
    prenom: 'David',
    matiere: 'Sciences Physiques',
    email: 'd.petit@edumanager.fr',
    telephone: '06 XX XX XX XX',
    status: 'Temps plein'
  },
  {
    id: '5',
    nom: 'Lambert',
    prenom: 'Sophie',
    matiere: 'Anglais',
    email: 's.lambert@edumanager.fr',
    telephone: '06 XX XX XX XX',
    status: 'Temps partiel'
  },
  {
    id: '6',
    nom: 'Roux',
    prenom: 'Pierre',
    matiere: 'SVT',
    email: 'p.roux@edumanager.fr',
    telephone: '06 XX XX XX XX',
    status: 'Temps plein'
  },
  {
    id: '7',
    nom: 'Blanc',
    prenom: 'Nathalie',
    matiere: 'Arts Plastiques',
    email: 'n.blanc@edumanager.fr',
    telephone: '06 XX XX XX XX',
    status: 'Vacataire'
  }
];

const Professeurs = () => {
  const [professeurs, setProfesseurs] = useState<Professeur[]>(professeursMockData);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProfesseur, setSelectedProfesseur] = useState<Professeur | null>(null);

  const handleAddProfesseur = (newProfesseur: Omit<Professeur, 'id'>) => {
    const id = (professeurs.length + 1).toString();
    const professeur = { ...newProfesseur, id };
    setProfesseurs([...professeurs, professeur]);
    toast.success('Professeur ajouté avec succès');
  };

  const handleEditProfesseur = (professeur: Professeur) => {
    setSelectedProfesseur(professeur);
    setEditDialogOpen(true);
  };

  const handleSaveProfesseur = (updatedProfesseur: Professeur) => {
    setProfesseurs(professeurs.map(p => 
      p.id === updatedProfesseur.id ? updatedProfesseur : p
    ));
    toast.success('Professeur modifié avec succès');
  };

  const handleViewDetails = (professeur: Professeur) => {
    setSelectedProfesseur(professeur);
    setDetailsDialogOpen(true);
  };

  const handleExport = (format: string) => {
    // TODO: Implémenter l'export
    toast.success(`Export des professeurs en format ${format.toUpperCase()} effectué`);
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      cell: (row: Professeur) => <span className="text-muted-foreground">P-{row.id.padStart(5, '0')}</span>
    },
    {
      key: 'professeur',
      header: 'Professeur',
      cell: (row: Professeur) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{row.prenom[0]}{row.nom[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.prenom} {row.nom}</p>
            <p className="text-xs text-muted-foreground">{row.matiere}</p>
          </div>
        </div>
      )
    },
    {
      key: 'matiere',
      header: 'Matière',
      cell: (row: Professeur) => <Badge variant="outline">{row.matiere}</Badge>
    },
    {
      key: 'contact',
      header: 'Contact',
      cell: (row: Professeur) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-xs gap-1">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span>{row.email}</span>
          </div>
          <div className="flex items-center text-xs gap-1">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>{row.telephone}</span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Statut',
      cell: (row: Professeur) => (
        <Badge variant={
          row.status === 'Temps plein' ? 'default' :
          row.status === 'Temps partiel' ? 'secondary' : 'outline'
        }>
          {row.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row: Professeur) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(row)}>
            Détails
          </Button>
        </div>
      )
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Gestion des professeurs"
          description="Gérez les professeurs et leur affectation"
          actions={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => handleExport('csv')}>
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
              <Button onClick={() => setNewDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouveau professeur
              </Button>
            </div>
          }
        />

        <DataTable 
          columns={columns}
          data={professeurs}
        />
      </div>

      <NewProfesseurDialog
        open={newDialogOpen}
        onOpenChange={setNewDialogOpen}
        onAddProfesseur={handleAddProfesseur}
      />

      <EditProfesseurDialog
        professeur={selectedProfesseur}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveProfesseur}
      />

      <ProfesseurDetailsDialog
        professeur={selectedProfesseur}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onEdit={handleEditProfesseur}
      />
    </MainLayout>
  );
};

export default Professeurs;
