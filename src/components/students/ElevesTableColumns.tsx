
import React from 'react';
import { Button } from "@/components/ui/button";
import EleveActions from './EleveActions';
import { Eleve } from '@/types/eleve';

type Column = {
  key: string;
  header: string;
  cell?: (row: any) => React.ReactNode;
};

export const getElevesColumns = (
  onEdit: (eleve: Eleve) => void,
  onDelete: (eleve: Eleve) => void,
  onView: (eleve: Eleve) => void
): Column[] => [
  {
    key: "nom",
    header: "Nom",
    cell: (row) => row.nom
  },
  {
    key: "prenom",
    header: "Prénom",
    cell: (row) => row.prenom
  },
  {
    key: "classe",
    header: "Classe",
    cell: (row) => row.classe
  },
  {
    key: "dateNaissance",
    header: "Date de naissance",
    cell: (row) => row.dateNaissance
  },
  {
    key: "responsable",
    header: "Responsable",
    cell: (row) => row.responsable
  },
  {
    key: "actions",
    header: "Actions",
    cell: (row) => (
      <EleveActions
        eleve={row}
        onEdit={() => onEdit(row)}
        onDelete={() => onDelete(row)}
        onView={() => onView(row)}
      />
    )
  }
];
