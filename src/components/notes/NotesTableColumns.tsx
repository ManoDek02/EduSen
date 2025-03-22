import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const getNotesColumns = (
  onEdit: (note: any) => void,
  onDelete: (note: any) => void
): ColumnDef<any>[] => [
  {
    accessorKey: 'eleveNom',
    header: 'Élève',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">
          {row.original.elevePrenom} {row.original.eleveNom}
        </div>
        <div className="text-xs text-muted-foreground">{row.original.classe}</div>
      </div>
    ),
  },
  {
    accessorKey: 'matiere',
    header: 'Matière',
  },
  {
    accessorKey: 'note',
    header: 'Note',
    cell: ({ row }) => {
      const note = parseFloat(row.original.note);
      let badgeVariant = 'default';
      let badgeClass = '';
      
      if (note < 8) {
        badgeVariant = 'destructive';
      } else if (note < 10) {
        badgeVariant = 'secondary';
        badgeClass = 'bg-orange-100 text-orange-800';
      } else if (note < 14) {
        badgeVariant = 'secondary';
        badgeClass = 'bg-yellow-100 text-yellow-800';
      } else if (note < 16) {
        badgeVariant = 'secondary';
        badgeClass = 'bg-green-100 text-green-800';
      } else {
        badgeVariant = 'secondary';
        badgeClass = 'bg-green-100 text-green-800 font-bold';
      }
      
      return (
        <div className="flex items-center gap-2">
          <Badge variant={badgeVariant} className={badgeClass}>
            {note}/20
          </Badge>
          {row.original.coefficient > 1 && (
            <span className="text-xs text-muted-foreground">
              (coef. {row.original.coefficient})
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.type}</Badge>
    ),
  },
  {
    accessorKey: 'trimestre',
    header: 'Trimestre',
    cell: ({ row }) => `Trimestre ${row.original.trimestre}`,
  },
  {
    accessorKey: 'dateEvaluation',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.dateEvaluation),
  },
  {
    accessorKey: 'professeur',
    header: 'Professeur',
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row.original)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
