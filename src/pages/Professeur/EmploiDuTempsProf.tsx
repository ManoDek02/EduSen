import React, { useState, useMemo, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { professeurConnecte } from '@/types/professeur';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';
import { Cours } from '@/types/cours';

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const heures = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

// Composant pour les cours dans l'emploi du temps
const CoursItem = ({ cours }: { cours: Cours }) => {
  return (
    <div
      className={cn(
        "absolute rounded-md border p-2 flex flex-col overflow-hidden shadow-sm transition-all hover:shadow-md",
        cours.couleur
      )}
      style={{
        top: `${cours.debut * 60 + 30}px`,
        height: `${cours.duree * 60 - 10}px`,
        left: '2px',
        right: '2px'
      }}
    >
      <div className="font-medium text-sm">{cours.matiere}</div>
      <div className="text-xs flex items-center gap-1">
        <User className="h-3 w-3" />
        {cours.classe}
      </div>
      <div className="text-xs mt-auto">{cours.salle}</div>
    </div>
  );
};

const EmploiDuTempsProf = () => {
  const [semaine, setSemaine] = useState('Semaine du 10 au 14 juin 2024');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cours, setCours] = useState<Cours[]>([]);

  // Filtrer les cours pour ne garder que ceux du professeur connecté
  const coursProfesseur = useMemo(() => {
    return cours.filter(cours => cours.professeurId === professeurConnecte.id);
  }, [cours, professeurConnecte.id]);

  // Gérer la navigation entre les semaines
  const handlePrevSemaine = () => {
    setSemaine('Semaine du 3 au 7 juin 2024');
  };

  const handleNextSemaine = () => {
    setSemaine('Semaine du 17 au 21 juin 2024');
  };

  // Gérer l'exportation des données
  const handleExport = (format: 'excel' | 'pdf') => {
    try {
      if (format === 'excel') {
        exportToExcel();
      } else {
        exportToPDF();
      }
    } catch (error) {
      toast.error(`Erreur lors de l'exportation en ${format.toUpperCase()}`);
      console.error(`Erreur d'exportation ${format}:`, error);
    }
  };

  // Exportation vers Excel
  const exportToExcel = () => {
    const excelData = coursProfesseur.map(cours => ({
      Jour: jours[cours.jour],
      Heure: `${heures[cours.debut]} - ${heures[cours.debut + cours.duree]}`,
      Classe: cours.classe,
      Matière: cours.matiere,
      Salle: cours.salle
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Ajouter des en-têtes personnalisés
    const headers = [
      ['Emploi du temps', professeurConnecte.nom, professeurConnecte.prenom],
      ['Semaine', semaine],
      [],
      ['Jour', 'Heure', 'Classe', 'Matière', 'Salle']
    ];
    XLSX.utils.sheet_add_aoa(ws, headers, { origin: 'A1' });

    // Ajuster la largeur des colonnes
    const colWidths = [
      { wch: 10 }, // Jour
      { wch: 15 }, // Heure
      { wch: 10 }, // Classe
      { wch: 15 }, // Matière
      { wch: 10 }  // Salle
    ];
    ws['!cols'] = colWidths;

    // Ajouter la feuille au classeur
    XLSX.utils.book_append_sheet(wb, ws, 'Emploi du temps');

    // Générer le fichier Excel
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `Emploi_du_temps_${professeurConnecte.nom}_${semaine}.xlsx`);

    toast.success('Export Excel réussi');
  };

  // Exportation vers PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // En-tête
    doc.setFontSize(16);
    doc.text('Emploi du temps', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`${professeurConnecte.nom} ${professeurConnecte.prenom}`, 105, 25, { align: 'center' });
    doc.text(semaine, 105, 32, { align: 'center' });

    // Préparer les données pour le tableau
    const tableData = coursProfesseur.map(cours => [
      jours[cours.jour],
      `${heures[cours.debut]} - ${heures[cours.debut + cours.duree]}`,
      cours.classe,
      cours.matiere,
      cours.salle
    ]);

    // Ajouter le tableau
    (doc as any).autoTable({
      startY: 40,
      head: [['Jour', 'Heure', 'Classe', 'Matière', 'Salle']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [0, 70, 173], // Couleur bleue de l'école
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    // Pied de page
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} sur ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Sauvegarder le PDF
    doc.save(`Emploi_du_temps_${professeurConnecte.nom}_${semaine}.pdf`);
    toast.success('Export PDF réussi');
  };

  // Fetch des données des cours
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/cours?professeurId=${professeurConnecte.id}`);
        const data = await response.json();
        setCours(data);
      } catch (err) {
        setError('Erreur de récupération des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [professeurConnecte.id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title={`Mon emploi du temps - ${professeurConnecte.prenom} ${professeurConnecte.nom}`}
          description="Consultez votre emploi du temps de la semaine"
          actions={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('excel')}
                className="hover:bg-green-50 hover:text-green-600"
              >
                <Download className="mr-2 h-4 w-4" />
                Excel
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('pdf')}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          }
        />

        <div className="space-y-6">
          {/* Other components or content */}
        </div>
      </div>
    </MainLayout>
  );
};

export default EmploiDuTempsProf;
