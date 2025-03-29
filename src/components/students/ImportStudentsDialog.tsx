import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface ImportStudentsDialogProps {
  onImportStudents: (students: any[]) => void;
}

const ImportStudentsDialog: React.FC<ImportStudentsDialogProps> = ({ onImportStudents }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          selectedFile.type === 'application/vnd.ms-excel' ||
          selectedFile.type === 'text/csv') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Format de fichier non supporté. Veuillez utiliser un fichier Excel ou CSV.');
        setFile(null);
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulation d'importation (à remplacer par votre logique d'importation réelle)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Générer des données de test
      const mockStudents = Array.from({ length: 5 }, (_, i) => ({
        id: `E${Math.floor(Math.random() * 10000)}`,
        nom: `Nom${i + 1}`,
        prenom: `Prénom${i + 1}`,
        classe: ['6ème A', '5ème B', '4ème A'][Math.floor(Math.random() * 3)],
        dateNaissance: '2010-01-01',
        responsable: `Responsable${i + 1}`,
        status: 'Actif'
      }));

      onImportStudents(mockStudents);
      toast.success(`${mockStudents.length} élèves importés avec succès`);
      setOpen(false);
    } catch (err) {
      setError('Une erreur est survenue lors de l\'importation. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Importer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importer des élèves</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Fichier Excel ou CSV</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="flex-1"
              />
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Formats acceptés : Excel (.xlsx, .xls) ou CSV
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border p-4">
            <h4 className="font-medium mb-2">Instructions</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Le fichier doit contenir les colonnes : Nom, Prénom, Classe, Date de naissance</li>
              <li>• La première ligne doit contenir les en-têtes des colonnes</li>
              <li>• Les dates doivent être au format YYYY-MM-DD</li>
              <li>• Les classes doivent correspondre aux classes existantes</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!file || isLoading}
          >
            {isLoading ? 'Importation...' : 'Importer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportStudentsDialog;
