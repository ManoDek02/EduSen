
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import TableSearch from './TableSearch';
import TablePagination from './TablePagination';
import TableSkeleton from './TableSkeleton';

type Column = {
  key: string;
  header: string;
  cell?: (row: any) => React.ReactNode;
};

type DataTableProps = {
  columns: Column[];
  data: any[];
  searchable?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
  className?: string;
  loading?: boolean;
  onRowClick?: (row: any) => void;
  additionalFilters?: React.ReactNode;
  searchTerm?: string;
  onSearch?: (term: string) => void;
};

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  searchable = true,
  pagination = true,
  itemsPerPage = 10,
  className,
  loading = false,
  onRowClick,
  additionalFilters,
  searchTerm: externalSearchTerm,
  onSearch: externalOnSearch
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  
  // Gestion de l'état de recherche - interne ou externe
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
  
  useEffect(() => {
    if (externalSearchTerm !== undefined) {
      setInternalSearchTerm(externalSearchTerm);
    }
  }, [externalSearchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setInternalSearchTerm(term);
    
    if (externalOnSearch) {
      externalOnSearch(term);
    }
  };

  // Filter data based on search term if no external search handler
  const filteredData = externalOnSearch 
    ? data 
    : (searchTerm
        ? data.filter(item =>
            Object.values(item).some(
              value =>
                value &&
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        : data);

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = pagination
    ? filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : filteredData;

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and filters */}
      {searchable && (
        <TableSearch 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange}
          additionalFilters={additionalFilters}
        />
      )}

      {/* Table */}
      <div className="rounded-md border bg-card overflow-hidden animate-fade-in">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {columns.map(column => (
                <TableHead key={column.key} className="font-medium">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton columnCount={columns.length} />
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow 
                  key={index}
                  className={cn(
                    "transition-colors",
                    onRowClick && "cursor-pointer hover:bg-muted/50"
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map(column => (
                    <TableCell key={`${column.key}-${index}`}>
                      {column.cell ? column.cell(row) : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  Aucun résultat trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      )}
    </div>
  );
};

export default DataTable;
