import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/tables/DataTable';
import NewStudentDialog from '@/components/students/NewStudentDialog';
import ImportStudentsDialog from '@/components/students/ImportStudentsDialog';
import ExportStudentsButton from '@/components/students/ExportStudentsButton';
import FilterStudentsDialog from '@/components/students/FilterStudentsDialog';
import { getElevesColumns } from '@/components/students/ElevesTableColumns';
import { elevesMockData } from '@/data/elevesMockData';
import { toast } from 'sonner';
import EleveDetailDialog from '@/components/students/EleveDetailDialog';
import EditStudentDialog from '@/components/students/EditStudentDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Eleve {
  id: string;
  nom: string;
  prenom: string;
  classe: string;
  dateNaissance: string;
  responsable: string;
  status: string;
  [key: string]: string;
}

interface Filters {
  classe?: string;
  niveaux?: string[];
  statut?: string[];
}

const Eleves = () => {
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);
  const [eleves, setEleves] = useState<Eleve[]>(elevesMockData);
  const [filteredEleves, setFilteredEleves] = useState<Eleve[]>(elevesMockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filters>({});
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAddStudent = (newStudent: Eleve) => {
    setEleves([...eleves, newStudent]);
    setFilteredEleves([...eleves, newStudent]);
    toast.success("Élève ajouté avec succès");
  };

  const handleImportStudents = (importedStudents: Eleve[]) => {
    const updatedEleves = [...eleves, ...importedStudents];
    setEleves(updatedEleves);
    applyFiltersAndSearch(updatedEleves, searchTerm, activeFilters);
    toast.success(`${importedStudents.length} élèves importés avec succès`);
  };

  const handleApplyFilters = (filters: Filters) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(eleves, searchTerm, filters);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSearch(eleves, term, activeFilters);
  };

  const applyFiltersAndSearch = (data: Eleve[], term: string, filters: Filters) => {
    let result = [...data];

    // Appliquer les filtres
    if (filters.classe) {
      result = result.filter(eleve => eleve.classe === filters.classe);
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

    if (filters.statut && filters.statut.length > 0) {
      result = result.filter(eleve => filters.statut.includes(eleve.status));
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

  const handleViewEleve = (eleve: Eleve) => {
    setSelectedEleve(eleve);
    setIsDetailDialogOpen(true);
  };

  const handleEditEleve = (eleve: Eleve) => {
    setSelectedEleve(eleve);
    setIsEditDialogOpen(true);
  };

  const handleDeleteEleve = (eleve: Eleve) => {
    setSelectedEleve(eleve);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEleve) {
      const updatedEleves = eleves.filter(e => e.id !== selectedEleve.id);
      setEleves(updatedEleves);
      applyFiltersAndSearch(updatedEleves, searchTerm, activeFilters);
      setIsDeleteDialogOpen(false);
      setSelectedEleve(null);
      toast.success("Élève supprimé avec succès");
    }
  };

  const handleUpdateEleve = (updatedEleve: Eleve) => {
    const updatedEleves = eleves.map(e => 
      e.id === updatedEleve.id ? updatedEleve : e
    );
    setEleves(updatedEleves);
    applyFiltersAndSearch(updatedEleves, searchTerm, activeFilters);
    setIsEditDialogOpen(false);
    setSelectedEleve(null);
    toast.success("Élève modifié avec succès");
  };

  // Get the table columns from our extracted component
  const columns = getElevesColumns(
    handleEditEleve,
    handleDeleteEleve,
    handleViewEleve
  );

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

        <EleveDetailDialog
          eleve={selectedEleve}
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
        />

        <EditStudentDialog
          eleve={selectedEleve}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdate={handleUpdateEleve}
        />

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Cela supprimera définitivement l'élève {selectedEleve?.prenom} {selectedEleve?.nom}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default Eleves;
