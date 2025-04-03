
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onNextPage,
  onPrevPage
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Affichage de {(currentPage - 1) * itemsPerPage + 1} à{' '}
        {Math.min(currentPage * itemsPerPage, totalItems)} sur{' '}
        {totalItems} entrées
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
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
          onClick={onNextPage}
          disabled={currentPage === totalPages}
        >
          {!isMobile && <span className="mr-1">Suivant</span>}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
