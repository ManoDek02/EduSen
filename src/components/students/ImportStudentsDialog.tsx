
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Format d'exemple attendu pour le CSV
const csvExample = `nom,prenom,dateNaissance,classe,responsable,email,telephone,adresse,status
Dupont,Marie,2006-05-15,3ème A,Jean Dupont,jean.dupont@example.com,0612345678,"15 rue des écoles, 75005 Paris",Actif
Martin,Lucas,2008-10-22,5ème B,Sophie Martin,sophie.martin@example.com,0687654321,"8 avenue Victor Hugo, 75016 Paris",Actif`;

const ImportStudentsDialog = ({ onImportStudents }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importPreview, setImportPreview] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleFile(selectedFile);
    }
  };

  const handleFile = (file) => {
    // Vérifier l'extension du fichier
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Format de fichier incorrect",
        description: "Veuillez charger un fichier CSV.",
        variant: "destructive"
      });
      return;
    }

    setFile(file);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const rows = content.split('\n');
        const headers = rows[0].split(',');
        
        // Vérifier si tous les en-têtes requis sont présents
        const requiredHeaders = ['nom', 'prenom', 'dateNaissance', 'classe'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          toast({
            title: "En-têtes manquants",
            description: `Les en-têtes suivants sont manquants: ${missingHeaders.join(', ')}`,
            variant: "destructive"
          });
          return;
        }
        
        // Créer un aperçu des données (5 premières lignes)
        const preview = [];
        const dataRows = rows.slice(1, 6); // 5 premières lignes de données
        
        for (const row of dataRows) {
          if (row.trim()) {
            const values = row.split(',');
            const obj = {};
            
            headers.forEach((header, i) => {
              obj[header.trim()] = values[i]?.trim() || '';
            });
            
            preview.push(obj);
          }
        }
        
        setImportPreview(preview);
        setIsPreviewMode(true);
      } catch (error) {
        toast({
          title: "Erreur de traitement",
          description: "Impossible de traiter le fichier CSV.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };

  const handleImport = () => {
    // Simuler l'import (dans une vraie application, on enverrait le fichier au serveur)
    // Ici, on suppose que l'import est réussi et on simule l'ajout de quelques élèves
    const newStudents = importPreview.map((student, index) => ({
      ...student,
      id: `imp-${Math.floor(Math.random() * 10000)}`,
    }));

    onImportStudents(newStudents);
    
    toast({
      title: "Import réussi",
      description: `${newStudents.length} élèves ont été importés.`,
    });
    
    setOpen(false);
    setFile(null);
    setImportPreview([]);
    setIsPreviewMode(false);
  };

  const resetImport = () => {
    setFile(null);
    setImportPreview([]);
    setIsPreviewMode(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newState) => {
      setOpen(newState);
      if (!newState) resetImport(); // Reset when closing
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Importer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importer des élèves</DialogTitle>
        </DialogHeader>

        {!isPreviewMode ? (
          <div className="space-y-4 pt-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Veuillez charger un fichier CSV avec les en-têtes suivants: nom, prenom, dateNaissance, classe, etc.
              </AlertDescription>
            </Alert>

            <div 
              className={`border-2 border-dashed rounded-md p-8 text-center ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/70" />
              <h3 className="mt-2 text-lg font-medium">Charger un fichier CSV</h3>
              <p className="mt-1 text-sm text-muted-foreground">Glissez-déposez votre fichier ici ou</p>
              <div className="mt-4">
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".csv"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                >
                  Parcourir
                </label>
              </div>
              {file && (
                <div className="mt-4 text-sm">
                  <span className="font-medium">{file.name}</span> ({Math.round(file.size / 1024)} Ko)
                </div>
              )}
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Format attendu (exemple) :</h3>
              <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
                {csvExample}
              </pre>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-medium">Aperçu de l'import ({importPreview.length} élèves) :</h3>
            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-2 py-2 text-left">Nom</th>
                      <th className="px-2 py-2 text-left">Prénom</th>
                      <th className="px-2 py-2 text-left">Date naissance</th>
                      <th className="px-2 py-2 text-left">Classe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.map((student, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                        <td className="px-2 py-2">{student.nom}</td>
                        <td className="px-2 py-2">{student.prenom}</td>
                        <td className="px-2 py-2">{student.dateNaissance}</td>
                        <td className="px-2 py-2">{student.classe}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {isPreviewMode && (
            <Button variant="outline" type="button" onClick={resetImport}>
              Retour
            </Button>
          )}
          <Button 
            onClick={isPreviewMode ? handleImport : () => {}}
            disabled={isPreviewMode ? false : !file}
          >
            {isPreviewMode ? "Confirmer l'import" : "Analyser le fichier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportStudentsDialog;
