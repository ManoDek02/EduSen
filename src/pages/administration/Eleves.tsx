
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

const Eleves = () => {
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);
  const [eleves, setEleves] = useState<Eleve[]>(elevesMockData);
  const [filteredEleves, setFilteredEleves] = useState<Eleve[]>(elevesMockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  const handleAddStudent = (newStudent: Eleve) => {
    setEleves([...eleves, newStudent]);
    setFilteredEleves([...eleves, newStudent]);
  };

  const handleImportStudents = (importedStudents: Eleve[]) => {
    const updatedEleves = [...eleves, ...importedStudents];
    setEleves(updatedEleves);
    applyFiltersAndSearch(updatedEleves, searchTerm, activeFilters);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(eleves, searchTerm, filters);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSearch(eleves, term, activeFilters);
  };

  const applyFiltersAndSearch = (data: Eleve[], term: string, filters: any) => {
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

  // Get the table columns from our extracted component
  const columns = getElevesColumns();

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
