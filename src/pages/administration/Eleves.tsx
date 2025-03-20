
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import DataTable from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NewStudentDialog from '@/components/students/NewStudentDialog';
import ImportStudentsDialog from '@/components/students/ImportStudentsDialog';
import ExportStudentsButton from '@/components/students/ExportStudentsButton';
import FilterStudentsDialog from '@/components/students/FilterStudentsDialog';

// Exemple de données pour les élèves
const elevesMockData = [
  {
    id: '1',
    nom: 'Martin',
    prenom: 'Sophie',
    classe: '3ème A',
    dateNaissance: '15/07/2009',
    responsable: 'Jean Martin',
    status: 'Actif'
  },
  {
    id: '2',
    nom: 'Dubois',
    prenom: 'Lucas',
    classe: '6ème B',
    dateNaissance: '22/03/2011',
    responsable: 'Marie Dubois',
    status: 'Actif'
  },
  {
    id: '3',
    nom: 'Bernard',
    prenom: 'Emma',
    classe: 'Terminale S',
    dateNaissance: '10/01/2005',
    responsable: 'Paul Bernard',
    status: 'Actif'
  },
  {
    id: '4',
    nom: 'Petit',
    prenom: 'Nathan',
    classe: '4ème C',
    dateNaissance: '05/09/2008',
    responsable: 'Sophie Petit',
    status: 'Inactif'
  },
  {
    id: '5',
    nom: 'Leroy',
    prenom: 'Jade',
    classe: '1ère ES',
    dateNaissance: '18/12/2006',
    responsable: 'Philippe Leroy',
    status: 'Actif'
  },
  {
    id: '6',
    nom: 'Moreau',
    prenom: 'Louis',
    classe: 'CM2',
    dateNaissance: '30/04/2012',
    responsable: 'Claire Moreau',
    status: 'Actif'
  },
  {
    id: '7',
    nom: 'Lambert',
    prenom: 'Chloé',
    classe: '5ème A',
    dateNaissance: '24/08/2010',
    responsable: 'Thomas Lambert',
    status: 'Actif'
  },
  {
    id: '8',
    nom: 'Fournier',
    prenom: 'Gabriel',
    classe: '2nde',
    dateNaissance: '12/05/2007',
    responsable: 'Laura Fournier',
    status: 'Inactif'
  }
];

const EleveDetailDialog = ({ eleve }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Détails de l'élève</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="informations" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="scolarite">Scolarité</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>
          <TabsContent value="informations" className="space-y-4 pt-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">{eleve.prenom[0]}{eleve.nom[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{eleve.prenom} {eleve.nom}</h3>
                <p className="text-sm text-muted-foreground">Élève en {eleve.classe}</p>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium">Date de naissance</p>
                    <p className="text-sm text-muted-foreground">{eleve.dateNaissance}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Âge</p>
                    <p className="text-sm text-muted-foreground">14 ans</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Genre</p>
                    <p className="text-sm text-muted-foreground">Féminin</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Numéro d'identification</p>
                    <p className="text-sm text-muted-foreground">E-{eleve.id.padStart(5, '0')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Adresse</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm">15 rue des Écoles</p>
                <p className="text-sm">75005 Paris</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scolarite" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Classe actuelle</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm font-medium">{eleve.classe}</p>
                <p className="text-sm text-muted-foreground">Année scolaire 2023-2024</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Parcours scolaire</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="border-l-2 border-muted pl-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium">2022-2023</p>
                    <p className="text-sm">4ème B - Collège Jean Moulin</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">2021-2022</p>
                    <p className="text-sm">5ème A - Collège Jean Moulin</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contacts" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Responsable principal</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{eleve.responsable.split(' ')[0][0]}{eleve.responsable.split(' ')[1][0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{eleve.responsable}</p>
                    <p className="text-sm text-muted-foreground">Parent</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <p>📱 06 XX XX XX XX</p>
                  <p>✉️ {eleve.responsable.split(' ')[0].toLowerCase()}.{eleve.responsable.split(' ')[1].toLowerCase()}@email.com</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Autres contacts</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">Aucun autre contact enregistré</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const Eleves = () => {
  const [selectedEleve, setSelectedEleve] = useState(null);
  const [eleves, setEleves] = useState(elevesMockData);
  const [filteredEleves, setFilteredEleves] = useState(elevesMockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  const handleAddStudent = (newStudent) => {
    setEleves([...eleves, newStudent]);
    setFilteredEleves([...eleves, newStudent]);
  };

  const handleImportStudents = (importedStudents) => {
    const updatedEleves = [...eleves, ...importedStudents];
    setEleves(updatedEleves);
    applyFiltersAndSearch(updatedEleves, searchTerm, activeFilters);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(eleves, searchTerm, filters);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    applyFiltersAndSearch(eleves, term, activeFilters);
  };

  const applyFiltersAndSearch = (data, term, filters) => {
    let result = [...data];

    // Appliquer les filtres
    if (filters.classe) {
      result = result.filter(eleve => eleve.classe === filters.classe);
    }

    if (filters.status && filters.status.length > 0) {
      result = result.filter(eleve => filters.status.includes(eleve.status));
    }

    if (filters.niveaux && filters.niveaux.length > 0) {
      const niveauMapping = {
        '1': ['6ème', '5ème', '4ème', '3ème'],
        '2': ['2nde', '1ère', 'Terminale']
      };

      result = result.filter(eleve => {
        for (const niveauId of filters.niveaux) {
          const niveauClasses = niveauMapping[niveauId];
          for (const niveauClasse of niveauClasses) {
            if (eleve.classe.includes(niveauClasse)) {
              return true;
            }
          }
        }
        return false;
      });
    }

    // Appliquer la recherche
    if (term) {
      result = result.filter(eleve => 
        Object.values(eleve).some(
          value => 
            value && 
            value.toString().toLowerCase().includes(term.toLowerCase())
        )
      );
    }

    setFilteredEleves(result);
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      cell: (row) => <span className="text-muted-foreground">E-{row.id.padStart(5, '0')}</span>
    },
    {
      key: 'identite',
      header: 'Identité',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{row.prenom[0]}{row.nom[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.prenom} {row.nom}</p>
            <p className="text-xs text-muted-foreground">Né(e) le {row.dateNaissance}</p>
          </div>
        </div>
      )
    },
    {
      key: 'classe',
      header: 'Classe',
      cell: (row) => <Badge variant="outline">{row.classe}</Badge>
    },
    {
      key: 'responsable',
      header: 'Responsable',
      cell: (row) => row.responsable
    },
    {
      key: 'status',
      header: 'Statut',
      cell: (row) => (
        <Badge variant={row.status === 'Actif' ? 'default' : 'secondary'}>
          {row.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <EleveDetailDialog eleve={row} />
        </div>
      )
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Gestion des élèves"
          description="Gérez les dossiers des élèves de l'établissement"
          actions={
            <div className="flex flex-wrap gap-2">
              <ImportStudentsDialog onImportStudents={handleImportStudents} />
              <ExportStudentsButton data={filteredEleves} />
              <NewStudentDialog onAddStudent={handleAddStudent} />
            </div>
          }
        />

        <DataTable 
          columns={columns}
          data={filteredEleves}
          onRowClick={(row) => setSelectedEleve(row)}
          searchable={true}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          additionalFilters={
            <FilterStudentsDialog onApplyFilters={handleApplyFilters} />
          }
        />
      </div>
    </MainLayout>
  );
};

export default Eleves;
