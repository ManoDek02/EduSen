
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import EleveDetailDialog from './EleveDetailDialog';

export const getElevesColumns = () => {
  return [
    {
      key: 'id',
      header: 'ID',
      cell: (row) => <span className="text-muted-foreground">E-{row.id.padStart(5, '0')}</span>
    },
    {
      key: 'identite',
      header: 'Identité',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{row.prenom[0]}{row.nom[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.prenom} {row.nom}</p>
            <p className="text-xs text-muted-foreground">Né(e) le {row.dateNaissance}</p>
          </div>
        </div>
      )
    },
    {
      key: 'classe',
      header: 'Classe',
      cell: (row) => <Badge variant="outline">{row.classe}</Badge>
    },
    {
      key: 'responsable',
      header: 'Responsable',
      cell: (row) => row.responsable
    },
    {
      key: 'status',
      header: 'Statut',
      cell: (row) => (
        <Badge variant={row.status === 'Actif' ? 'default' : 'secondary'}>
          {row.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <EleveDetailDialog eleve={row} />
        </div>
      )
    }
  ];
};
