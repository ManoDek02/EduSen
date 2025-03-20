
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Define a type for the student data
interface StudentData {
  [key: string]: string | number | boolean | undefined;
}

const ExportStudentsButton = ({ data }: { data: StudentData[] }) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    try {
      // Obtenir toutes les clés uniques pour les en-têtes
      const headers = Array.from(
        new Set(
          data.flatMap(item => Object.keys(item))
        )
      );
      
      // Filtrer les clés pour exclure certains champs techniques si nécessaire
      const filteredHeaders = headers.filter(
        header => !['actions', 'identite'].includes(header)
      );
      
      // Créer la ligne d'en-tête
      let csvContent = filteredHeaders.join(',') + '\n';
      
      // Ajouter les données
      data.forEach(item => {
        const row = filteredHeaders.map(header => {
          let value = item[header] || '';
          
          // Gérer les valeurs qui pourraient contenir des virgules
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            // Échapper les guillemets doubles en doublant les guillemets
            value = value.replace(/"/g, '""');
            // Entourer de guillemets
            value = `"${value}"`;
          }
          
          return value;
        });
        
        csvContent += row.join(',') + '\n';
      });
      
      // Créer un Blob et un URL d'objet pour le téléchargement
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Créer un lien de téléchargement et cliquer dessus
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `eleves_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export réussi",
        description: `${data.length} élèves ont été exportés.`,
      });
    } catch (error) {
      toast({
        title: "Erreur lors de l'export",
        description: "Une erreur s'est produite pendant l'export.",
        variant: "destructive"
      });
    }
  };

  const exportToExcel = () => {
    // Simuler l'export Excel (dans une application réelle, utilisez une bibliothèque comme ExcelJS)
    toast({
      title: "Export Excel",
      description: "Cette fonctionnalité sera disponible dans une future mise à jour.",
    });
  };

  const exportToPDF = () => {
    // Simuler l'export PDF (dans une application réelle, utilisez une bibliothèque comme jsPDF)
    toast({
      title: "Export PDF",
      description: "Cette fonctionnalité sera disponible dans une future mise à jour.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          Format CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          Format Excel (XLSX)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          Format PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportStudentsButton;
