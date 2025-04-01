
import React from 'react';
import DataTable from '@/components/tables/DataTable';
import { getElevesColumns } from '@/components/students/ElevesTableColumns';
import FilterStudentsDialog from '@/components/students/FilterStudentsDialog';
import { Eleve } from '@/types/eleve';

interface ElevesListProps {
  eleves: Eleve[];
  loading: boolean;
  searchTerm: string;
  onSearch: (term: string) => void;
  onApplyFilters: (filters: any) => void;
  onEditEleve: (eleve: Eleve) => void;
  onDeleteEleve: (eleve: Eleve) => void;
  onViewEleve: (eleve: Eleve) => void;
  setSelectedEleve: (eleve: Eleve) => void;
}

const ElevesList: React.FC<ElevesListProps> = ({
  eleves,
  loading,
  searchTerm,
  onSearch,
  onApplyFilters,
  onEditEleve,
  onDeleteEleve,
  onViewEleve,
  setSelectedEleve
}) => {
  // Get the table columns
  const columns = getElevesColumns(
    onEditEleve,
    onDeleteEleve,
    onViewEleve
  );

  return (
    <DataTable 
      columns={columns}
      data={eleves}
      onRowClick={(row) => setSelectedEleve(row)}
      searchable={true}
      searchTerm={searchTerm}
      onSearch={onSearch}
      loading={loading}
      additionalFilters={
        <FilterStudentsDialog onApplyFilters={onApplyFilters} />
      }
    />
  );
};

export default ElevesList;
