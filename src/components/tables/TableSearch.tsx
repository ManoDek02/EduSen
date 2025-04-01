
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TableSearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  additionalFilters?: React.ReactNode;
}

const TableSearch: React.FC<TableSearchProps> = ({
  searchTerm,
  onSearchChange,
  additionalFilters
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          className="pl-8 w-full sm:w-[300px]"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      {additionalFilters}
    </div>
  );
};

export default TableSearch;
