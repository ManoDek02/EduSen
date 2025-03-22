
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { NoteDetailDialog } from './NoteDetailDialog';

export const getNotesColumns = (onEdit, onDelete) => {
  return [
    {
      key: 'id',
      header: 'ID',
      cell: (row) => <span className="text-muted-foreground">N-{row.id.padStart(4, '0')}</span>
    },
    {
      key: 'eleve',
      header: 'Élève',
      cell: (row) => (
        <div>
          <p className="font-medium">{row.elevePrenom} {row.eleveNom}</p>
          <p className="text-xs text-muted-foreground">{row.classe}</p>
        </div>
      )
    },
    {
      key: 'matiere',
      header: 'Matière',
      cell: (row) => <span>{row.matiere}</span>
    },
    {
      key: 'note',
      header: 'Note',
      cell: (row) => {
        const noteValue = parseFloat(row.note);
        let badgeVariant = 'default';
        
        if (noteValue < 8) badgeVariant = 'destructive';
        else if (noteValue < 10) badgeVariant = 'secondary';
        else if (noteValue >= 16) badgeVariant = 'success';
        
        return (
          <div className="flex items-baseline gap-2">
            <Badge variant={badgeVariant as "default" | "destructive" | "secondary" | "outline" | "success"} className="text-md font-bold">
              {row.note}/20
            </Badge>
            {row.coefficient > 1 && (
              <span className="text-xs text-muted-foreground">
                Coef. {row.coefficient}
              </span>
            )}
          </div>
        );
      }
    },
    {
      key: 'type',
      header: 'Type',
      cell: (row) => <Badge variant="outline">{row.type}</Badge>
    },
    {
      key: 'dateEvaluation',
      header: 'Date',
      cell: (row) => {
        const date = new Date(row.dateEvaluation);
        return (
          <span className="text-sm">
            {date.toLocaleDateString('fr-FR')}
          </span>
        );
      }
    },
    {
      key: 'trimestre',
      header: 'Trimestre',
      cell: (row) => <span>T{row.trimestre}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <NoteDetailDialog note={row} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row)}
            className="h-8 w-8 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];
};
