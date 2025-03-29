import React from 'react';
import { Button } from "@/components/ui/button";
import EleveActions from './EleveActions';

type Column = {
  key: string;
  header: string;
  cell?: (row: any) => React.ReactNode;
};

interface Eleve {
  id: string;
  nom: string;
  prenom: string;
  classe: string;
  dateNaissance: string;
  responsable: string;
  status: string;
  [key: string]: string;
}

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
