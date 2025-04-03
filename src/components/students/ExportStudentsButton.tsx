
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from 'xlsx';
import { Eleve } from '@/types/eleve';

interface ExportStudentsButtonProps {
  data: Eleve[];
}

const ExportStudentsButton: React.FC<ExportStudentsButtonProps> = ({ data }) => {
  const handleExport = () => {
    // Convert Eleve array to key-value pairs that XLSX can handle
    const exportData = data.map(eleve => ({
      'Nom': eleve.nom,
      'Prénom': eleve.prenom,
      'Classe': eleve.classe,
      'Date de naissance': eleve.dateNaissance,
      'Responsable': eleve.responsable,
      'Statut': eleve.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Élèves");
    
    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `eleves_${date}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Exporter
    </Button>
  );
};

export default ExportStudentsButton;
