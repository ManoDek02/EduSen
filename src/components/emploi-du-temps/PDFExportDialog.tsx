import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface PDFExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cours: any[];
  classe: string;
  semaine: string;
}

export const PDFExportDialog = ({ open, onOpenChange, cours, classe, semaine }: PDFExportDialogProps) => {
  const [format, setFormat] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');
  const [includeDetails, setIncludeDetails] = useState(true);

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: orientation as 'portrait' | 'landscape',
      format: format as 'a4' | 'a3'
    });

    // En-tête
    doc.setFontSize(16);
    doc.text('Emploi du temps', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`${classe} - ${semaine}`, 105, 30, { align: 'center' });

    // Tableau des cours
    const tableData = cours.map(c => [
      c.jour,
      c.matiere,
      c.professeur,
      c.salle,
      `${c.debut}h - ${c.debut + c.duree}h`
    ]);

    (doc as any).autoTable({
      startY: 40,
      head: [['Jour', 'Matière', 'Professeur', 'Salle', 'Horaires']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 }
    });

    // Détails supplémentaires si demandé
    if (includeDetails) {
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text('Détails des cours :', 20, finalY);
      cours.forEach((c, index) => {
        doc.text(`${c.matiere} : ${c.professeur} - ${c.salle}`, 30, finalY + 10 + (index * 7));
      });
    }

    // Sauvegarde du PDF
    doc.save(`emploi-du-temps-${classe}-${semaine}.pdf`);
    toast.success('PDF généré avec succès');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exporter en PDF</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A4">A4</SelectItem>
                <SelectItem value="A3">A3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Orientation</Label>
            <Select value={orientation} onValueChange={setOrientation}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une orientation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="landscape">Paysage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeDetails"
              checked={includeDetails}
              onCheckedChange={(checked) => setIncludeDetails(checked as boolean)}
            />
            <Label htmlFor="includeDetails">Inclure les détails des cours</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={generatePDF}>
            Générer le PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 