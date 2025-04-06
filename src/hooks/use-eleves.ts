import { useState, useEffect } from 'react';
import { Eleve } from '@/types/eleve';
import { getEleves, addEleve, updateEleve, deleteEleve, filterEleves } from '@/services/elevesService';
import { toast } from 'sonner';

interface Filters {
  classe?: string;
  status?: string[];
}

export const useEleves = () => {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [filteredEleves, setFilteredEleves] = useState<Eleve[]>([]);
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEleves();
  }, []);

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
        toast.success("Élève modifié avec succès");
      } catch (error) {
        toast.error("Erreur lors de la modification de l'élève");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteEleve = async () => {
    if (selectedEleve) {
      try {
        setLoading(true);
        await deleteEleve(selectedEleve.id);
        const updatedEleves = eleves.filter(e => e.id !== selectedEleve.id);
        setEleves(updatedEleves);
        setFilteredEleves(updatedEleves.filter(e => 
          (!activeFilters.classe || e.classe === activeFilters.classe) &&
          (!activeFilters.status || activeFilters.status.includes(e.status))
        ));
        toast.success("Élève supprimé avec succès");
      } catch (error) {
        toast.error("Erreur lors de la suppression de l'élève");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleApplyFilters = async (filters: Filters) => {
    setActiveFilters(filters);
    try {
      setLoading(true);
      const filteredData = await filterEleves({
        searchTerm: searchTerm,
        classe: filters.classe,
        status: filters.status
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
        searchTerm: searchTerm,
        classe: filters.classe,
        status: filters.status
      });
      setFilteredEleves(filteredData);
    } catch (error) {
      toast.error("Erreur lors du filtrage des élèves");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    eleves,
    filteredEleves,
    selectedEleve,
    setSelectedEleve,
    loading,
    searchTerm,
    handleAddStudent,
    handleImportStudents,
    handleUpdateEleve,
    handleDeleteEleve,
    handleApplyFilters,
    handleSearch
  };
};
