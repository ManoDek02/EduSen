
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const DataTable = ({
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
}: DataTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const isMobile = useIsMobile();

  // Gestion de l'état de recherche - interne ou externe
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
  
  useEffect(() => {
    if (externalSearchTerm !== undefined) {
      setInternalSearchTerm(externalSearchTerm);
    }
  }, [externalSearchTerm]);

  const handleSearchChange = (e) => {
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
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          {additionalFilters}
        </div>
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
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map(column => (
                    <TableCell key={`skeleton-${column.key}-${index}`}>
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Affichage de {(currentPage - 1) * itemsPerPage + 1} à{' '}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} sur{' '}
            {filteredData.length} entrées
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              {!isMobile && <span className="ml-1">Précédent</span>}
            </Button>
            <div className="text-sm">
              Page {currentPage} sur {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              {!isMobile && <span className="mr-1">Suivant</span>}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
