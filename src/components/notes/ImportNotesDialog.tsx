import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { professeurConnecte } from '@/types/professeur';
import type { Note } from '@/types/note';

interface ImportNotesDialogProps {
  onImportNotes: (notes: Note[]) => void;
  selectedClass: string;
  selectedMatiere: string;
}

export const ImportNotesDialog = ({ onImportNotes, selectedClass, selectedMatiere }: ImportNotesDialogProps) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          selectedFile.type === 'text/csv') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Format de fichier non supporté. Veuillez utiliser un fichier Excel (.xlsx) ou CSV.');
        setFile(null);
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Convertir les données Excel en format Note
          const notes: Note[] = jsonData.map((row: any) => ({
            id: `${row['ID Élève']}-${selectedMatiere}-${Date.now()}`,
            eleveId: row['ID Élève'] || '',
            eleveNom: row['Nom'],
            elevePrenom: row['Prénom'],
            classe: selectedClass,
            matiere: selectedMatiere,
            note: parseFloat(row['Note']),
            coefficient: parseFloat(row['Coefficient']) || 1,
            professeur: professeurConnecte.id,
            trimestre: parseInt(row['Trimestre']) || 1,
            dateEvaluation: row['Date'] || new Date().toISOString().split('T')[0],
            commentaire: row['Commentaire'] || '',
            type: row['Type'] || 'Contrôle'
          }));

          // Validation des notes
          const invalidNotes = notes.filter(note => 
            note.note < 0 || note.note > 20 || 
            !note.eleveNom || !note.elevePrenom
          );

          if (invalidNotes.length > 0) {
            setError(`${invalidNotes.length} notes invalides détectées. Veuillez vérifier le format du fichier.`);
            return;
          }

          onImportNotes(notes);
          toast.success(`${notes.length} notes importées avec succès`);
          setOpen(false);
        } catch (error) {
          setError("Erreur lors de l'import du fichier. Vérifiez le format.");
          console.error('Erreur d\'import:', error);
        }
      };

      reader.readAsBinaryString(file);
    } catch (err) {
      setError('Une erreur est survenue lors de l\'importation des notes.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Importer des notes
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importer des notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Fichier Excel ou CSV</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button variant="outline" size="icon" onClick={() => document.getElementById('file-upload')?.click()}>
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Format attendu :</p>
              <ul className="list-disc pl-4 mt-2">
                <li>Fichier Excel (.xlsx) ou CSV</li>
                <li>Colonnes requises :</li>
                <ul className="list-disc pl-4 mt-1">
                  <li>ID Élève</li>
                  <li>Nom</li>
                  <li>Prénom</li>
                  <li>Note (sur 20)</li>
                  <li>Coefficient (optionnel, par défaut: 1)</li>
                  <li>Trimestre (optionnel, par défaut: 1)</li>
                  <li>Date (optionnel, format: YYYY-MM-DD)</li>
                  <li>Type (optionnel, par défaut: Contrôle)</li>
                  <li>Commentaire (optionnel)</li>
                </ul>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleImport} disabled={!file || isLoading}>
              {isLoading ? 'Importation...' : 'Importer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImportNotesDialog; 