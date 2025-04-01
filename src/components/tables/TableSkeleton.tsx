
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

interface TableSkeletonProps {
  columnCount: number;
  rowCount?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columnCount,
  rowCount = 5
}) => {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, index) => (
        <TableRow key={`skeleton-${index}`} className="animate-pulse">
          {Array.from({ length: columnCount }).map((_, cellIndex) => (
            <TableCell key={`skeleton-cell-${index}-${cellIndex}`}>
              <div className="h-4 w-full bg-muted rounded" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
