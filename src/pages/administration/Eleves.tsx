
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/tables/DataTable';
import NewStudentDialog from '@/components/students/NewStudentDialog';
import ImportStudentsDialog from '@/components/students/ImportStudentsDialog';
import ExportStudentsButton from '@/components/students/ExportStudentsButton';
import FilterStudentsDialog from '@/components/students/FilterStudentsDialog';
import { getElevesColumns } from '@/components/students/ElevesTableColumns';
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
import { Eleve } from '@/types/eleve';
import { getEleves, addEleve, updateEleve, deleteEleve, filterEleves } from '@/services/elevesService';

interface Filters {
  classe?: string;
  niveaux?: string[];
  statut?: string[];
}

const Eleves = () => {
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [filteredEleves, setFilteredEleves] = useState<Eleve[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filters>({});
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charger les élèves depuis Supabase au chargement de la page
  useEffect(() => {
    const loadEleves = async () => {
      try {
        setLoading(true);
        const data = await getEleves();
        setEleves(data);
        setFilteredEleves(data);
      } catch (error) {
        toast.error("Erreur lors du chargement des élèves");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadEleves();
  }, []);

  const handleAddStudent = async (newStudent: Omit<Eleve, 'id'>) => {
    try {
      setLoading(true);
      const addedEleve = await addEleve(newStudent);
      setEleves(prev => [...prev, addedEleve]);
      setFilteredEleves(prev => [...prev, addedEleve]);
      toast.success("Élève ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'élève");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportStudents = async (importedStudents: Omit<Eleve, 'id'>[]) => {
    try {
      setLoading(true);
      const addedEleves = [];
      
      for (const student of importedStudents) {
        const addedEleve = await addEleve(student);
        addedEleves.push(addedEleve);
      }
      
      const updatedEleves = [...eleves, ...addedEleves];
      setEleves(updatedEleves);
      applyFiltersAndSearch(updatedEleves, searchTerm, activeFilters);
      toast.success(`${importedStudents.length} élèves importés avec succès`);
    } catch (error) {
      toast.error("Erreur lors de l'importation des élèves");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async (filters: Filters) => {
    setActiveFilters(filters);
    try {
      setLoading(true);
      const filteredData = await filterEleves({
        terme: searchTerm,
        classe: filters.classe,
        niveaux: filters.niveaux,
        statut: filters.statut
      });
      setFilteredEleves(filteredData);
    } catch (error) {
      toast.error("Erreur lors du filtrage des élèves");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSearch(eleves, term, activeFilters);
  };

  const applyFiltersAndSearch = async (data: Eleve[], term: string, filters: Filters) => {
    try {
      setLoading(true);
      const filteredData = await filterEleves({
        terme: term,
        classe: filters.classe,
        niveaux: filters.niveaux,
        statut: filters.statut
      });
      setFilteredEleves(filteredData);
    } catch (error) {
      toast.error("Erreur lors du filtrage des élèves");
      console.error(error);
    } finally {
      setLoading(false);
    }
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

  const confirmDelete = async () => {
    if (selectedEleve) {
      try {
        setLoading(true);
        await deleteEleve(selectedEleve.id);
        const updatedEleves = eleves.filter(e => e.id !== selectedEleve.id);
        setEleves(updatedEleves);
        setFilteredEleves(updatedEleves.filter(e => 
          (!activeFilters.classe || e.classe === activeFilters.classe) &&
          (!activeFilters.statut || activeFilters.statut.includes(e.status))
        ));
        setIsDeleteDialogOpen(false);
        setSelectedEleve(null);
        toast.success("Élève supprimé avec succès");
      } catch (error) {
        toast.error("Erreur lors de la suppression de l'élève");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateEleve = async (updatedEleveData: Eleve) => {
    if (selectedEleve) {
      try {
        setLoading(true);
        const updated = await updateEleve(selectedEleve.id, updatedEleveData);
        const updatedEleves = eleves.map(e => 
          e.id === selectedEleve.id ? updated : e
        );
        setEleves(updatedEleves);
        applyFiltersAndSearch(updatedEleves, searchTerm, activeFilters);
        setIsEditDialogOpen(false);
        setSelectedEleve(null);
        toast.success("Élève modifié avec succès");
      } catch (error) {
        toast.error("Erreur lors de la modification de l'élève");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
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
          loading={loading}
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
