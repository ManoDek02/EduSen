import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/tables/DataTable';
import { getNotesColumns } from '@/components/notes/NotesTableColumns';
import { notesMockData } from '@/data/notesMockData';
import NewNoteDialog from '@/components/notes/NewNoteDialog';
import FilterNotesDialog from '@/components/notes/FilterNotesDialog';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, File, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { matieres } from '@/components/notes/form/NoteFormSchema';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { jsPDF as JSPDFType } from 'jspdf';
import { professeurConnecte } from '@/types/professeur';
import ImportNotesDialog from '@/components/notes/ImportNotesDialog';

interface Note {
  id: string;
  eleveId: string;
  eleveNom: string;
  elevePrenom: string;
  classe: string;
  matiere: string;
  note: number;
  coefficient: number;
  professeur: string;
  trimestre: number;
  dateEvaluation: string;
  commentaire: string;
  type: string;
}

interface NoteGrouped {
  eleveId: string;
  eleveNom: string;
  elevePrenom: string;
  classe: string;
  matiere: string;
  note1: Note | null;
  note2: Note | null;
  moyenne: number;
}

// This adapter transforms @tanstack/react-table ColumnDef to our DataTable Column type
const adaptColumns = (columns) => {
  return columns.map(column => ({
    key: column.accessorKey || column.id,
    header: column.header,
    cell: column.cell ? (row) => column.cell({ row: { original: row } }) : undefined
  }));
};

const Notes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>(notesMockData);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(notesMockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedMatiere, setSelectedMatiere] = useState<string>("");

  // Filtrer les notes pour ne garder que celles des classes assignées au professeur
  const professeurNotes = useMemo(() => {
    return notes.filter(note => {
      const classe = professeurConnecte.classes.find(c => c.id === note.classe);
      return classe && classe.matieres.includes(note.matiere);
    });
  }, [notes]);

  // Extraire les classes uniques des notes du professeur
  const classes = Array.from(new Set(professeurNotes.map(note => note.classe))).sort();

  // Obtenir les matières disponibles pour la classe sélectionnée
  const matieresDisponibles = useMemo(() => {
    if (!selectedClass) return [];
    const classe = professeurConnecte.classes.find(c => c.id === selectedClass);
    return classe ? classe.matieres : [];
  }, [selectedClass]);

  // Regrouper les notes par élève
  const groupedNotes = useMemo(() => {
    const grouped = professeurNotes.reduce((acc: { [key: string]: NoteGrouped }, note) => {
      const key = `${note.eleveId}-${note.matiere}-${note.classe}`;
      if (!acc[key]) {
        acc[key] = {
          eleveId: note.eleveId,
          eleveNom: note.eleveNom,
          elevePrenom: note.elevePrenom,
          classe: note.classe,
          matiere: note.matiere,
          note1: null,
          note2: null,
          moyenne: 0
        };
      }

      if (!acc[key].note1) {
        acc[key].note1 = note;
      } else {
        acc[key].note2 = note;
      }

      return acc;
    }, {});

    // Calculer les moyennes
    return Object.values(grouped).map(group => {
      if (group.note1 && group.note2) {
        const totalCoeff = group.note1.coefficient + group.note2.coefficient;
        const moyenne = (group.note1.note * group.note1.coefficient + group.note2.note * group.note2.coefficient) / totalCoeff;
        return { ...group, moyenne };
      }
      return group;
    });
  }, [professeurNotes]);

  const [filteredGroupedNotes, setFilteredGroupedNotes] = useState<NoteGrouped[]>(groupedNotes);

  const handleAddNote = (newNote: Note) => {
    // Vérifier si l'élève a déjà au moins 2 notes dans cette matière
    const notesEleve = professeurNotes.filter(n => 
      n.eleveId === newNote.eleveId && 
      n.matiere === newNote.matiere && 
      n.classe === newNote.classe
    );

    if (notesEleve.length >= 2) {
      toast.warning("L'élève a déjà 2 notes dans cette matière");
      return;
    }

    // Vérifier si l'élève a déjà une note dans cette matière
    if (notesEleve.length === 1) {
      // Si c'est la deuxième note, vérifier que le type d'évaluation est différent
      const typeExistant = notesEleve[0].type;
      if (newNote.type === typeExistant) {
        toast.warning("Les deux notes doivent être de types d'évaluation différents");
        return;
      }
    }

    // Vérifier que la matière est bien enseignée par le professeur dans cette classe
    const classe = professeurConnecte.classes.find(c => c.id === newNote.classe);
    if (!classe || !classe.matieres.includes(newNote.matiere)) {
      toast.error("Vous n'êtes pas autorisé à ajouter une note dans cette matière pour cette classe");
      return;
    }

    const updatedNotes = [...professeurNotes, newNote];
    setNotes(updatedNotes);
    applyFiltersAndSearch(updatedNotes, searchTerm, { classe: selectedClass, matiere: selectedMatiere });
    toast.success('Note ajoutée avec succès');
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    // Logique d'édition à implémenter
    toast.info("Fonctionnalité d'édition à implémenter");
  };

  const handleDeleteNote = (note: Note) => {
    setNoteToDelete(note);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!noteToDelete) return;
    
    const updatedNotes = professeurNotes.filter(n => n.id !== noteToDelete.id);
    setNotes(updatedNotes);
    applyFiltersAndSearch(updatedNotes, searchTerm, { classe: selectedClass, matiere: selectedMatiere });
    toast.success('Note supprimée avec succès');
    
    setConfirmDialogOpen(false);
    setNoteToDelete(null);
  };

  const handleApplyFilters = (filters) => {
    applyFiltersAndSearch(professeurNotes, searchTerm, { ...filters, classe: selectedClass, matiere: selectedMatiere });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSearch(professeurNotes, term, { classe: selectedClass, matiere: selectedMatiere });
  };

  const handleClassChange = (classe: string) => {
    setSelectedClass(classe);
    setSelectedMatiere(""); // Réinitialiser la matière sélectionnée
    applyFiltersAndSearch(professeurNotes, searchTerm, { classe, matiere: "" });
  };

  const handleMatiereChange = (matiere: string) => {
    setSelectedMatiere(matiere);
    applyFiltersAndSearch(professeurNotes, searchTerm, { classe: selectedClass, matiere });
  };

  const applyFiltersAndSearch = (data: Note[], term: string, filters: any) => {
    let result = [...data];

    if (filters.classe) {
      result = result.filter(note => note.classe === filters.classe);
    }

    if (filters.matiere) {
      result = result.filter(note => note.matiere === filters.matiere);
    }

    if (filters.trimestre) {
      result = result.filter(note => note.trimestre === filters.trimestre);
    }

    if (filters.typesEvaluation && filters.typesEvaluation.length > 0) {
      result = result.filter(note => filters.typesEvaluation.includes(note.type));
    }

    if (filters.noteRange) {
      if (filters.noteRange.min !== undefined) {
        result = result.filter(note => note.note >= filters.noteRange.min);
      }
      if (filters.noteRange.max !== undefined) {
        result = result.filter(note => note.note <= filters.noteRange.max);
      }
    }

    if (term) {
      result = result.filter(note => 
        Object.values(note).some(
          value => 
            value && 
            value.toString().toLowerCase().includes(term.toLowerCase())
        ) ||
        `${note.elevePrenom} ${note.eleveNom}`.toLowerCase().includes(term.toLowerCase())
      );
    }

    setFilteredNotes(result);
  };

  const handleExport = (format: 'excel' | 'pdf' | 'csv') => {
    if (!selectedClass || !selectedMatiere) {
      toast.error("Veuillez sélectionner une classe et une matière avant d'exporter");
      return;
    }

    const notesToExport = filteredGroupedNotes.map(group => ({
      'Nom': group.eleveNom,
      'Prénom': group.elevePrenom,
      'Classe': group.classe,
      'Matière': group.matiere,
      'Note 1': group.note1 ? `${group.note1.note} (${group.note1.type})` : '-',
      'Note 2': group.note2 ? `${group.note2.note} (${group.note2.type})` : '-',
      'Moyenne': group.moyenne.toFixed(2)
    }));

    if (format === 'excel' || format === 'csv') {
      const ws = XLSX.utils.json_to_sheet(notesToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Notes');
      XLSX.writeFile(wb, `notes_${selectedClass}_${selectedMatiere}.${format === 'excel' ? 'xlsx' : 'csv'}`);
    } else if (format === 'pdf') {
      const doc = new jsPDF() as JSPDFType & { autoTable: (options: any) => void };
      doc.autoTable({
        head: [Object.keys(notesToExport[0])],
        body: notesToExport.map(Object.values),
        theme: 'grid'
      });
      doc.save(`notes_${selectedClass}_${selectedMatiere}.pdf`);
    }

    toast.success(`Export des notes en format ${format.toUpperCase()} effectué`);
  };

  const handleImportNotes = (newNotes: Note[]) => {
    // Vérifier que les notes sont pour la classe et matière sélectionnées
    const validNotes = newNotes.filter(note => 
      note.classe === selectedClass && 
      note.matiere === selectedMatiere
    );

    if (validNotes.length === 0) {
      toast.error("Aucune note valide à importer pour la classe et matière sélectionnées");
      return;
    }

    // Vérifier les doublons et les limites de notes
    const updatedNotes = [...notes];
    let importedCount = 0;

    validNotes.forEach(note => {
      const existingNotes = updatedNotes.filter(n => 
        n.eleveId === note.eleveId && 
        n.matiere === note.matiere && 
        n.classe === note.classe
      );

      if (existingNotes.length < 2) {
        updatedNotes.push(note);
        importedCount++;
      }
    });

    setNotes(updatedNotes);
    applyFiltersAndSearch(updatedNotes, searchTerm, { classe: selectedClass, matiere: selectedMatiere });
    
    if (importedCount > 0) {
      toast.success(`${importedCount} notes importées avec succès`);
    } else {
      toast.warning("Aucune nouvelle note n'a été importée (limite de 2 notes par élève atteinte)");
    }
  };

  const columns = [
    {
      key: 'eleve',
      header: 'Élève',
      cell: (row: NoteGrouped) => `${row.elevePrenom} ${row.eleveNom}`
    },
    {
      key: 'note1',
      header: 'Note 1',
      cell: (row: NoteGrouped) => row.note1 ? (
        <div>
          <div className="font-medium">{row.note1.note}/20</div>
          <div className="text-sm text-gray-500">{row.note1.type}</div>
        </div>
      ) : '-'
    },
    {
      key: 'note2',
      header: 'Note 2',
      cell: (row: NoteGrouped) => row.note2 ? (
        <div>
          <div className="font-medium">{row.note2.note}/20</div>
          <div className="text-sm text-gray-500">{row.note2.type}</div>
        </div>
      ) : '-'
    },
    {
      key: 'moyenne',
      header: 'Moyenne',
      cell: (row: NoteGrouped) => row.moyenne ? (
        <div className="font-medium">{row.moyenne.toFixed(2)}/20</div>
      ) : '-'
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row: NoteGrouped) => (
        <div className="flex gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEditNote(row.note1!)} 
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
              >
                Modifier Note 1
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDeleteNote(row.note1!)} 
                className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
              >
                Supprimer Note 1
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEditNote(row.note2!)} 
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
              >
                Modifier Note 2
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDeleteNote(row.note2!)} 
                className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
              >
                Supprimer Note 2
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title={`Gestion des notes - ${professeurConnecte.prenom} ${professeurConnecte.nom}`}
          description="Gérez les notes et évaluations des élèves"
          actions={
            <div className="flex flex-wrap gap-2">
              <div className="w-[200px]">
                <Select value={selectedClass} onValueChange={handleClassChange}>
                  <SelectTrigger className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 focus:ring-blue-500">
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((className) => (
                      <SelectItem key={className} value={className}>
                        {professeurConnecte.classes.find(c => c.id === className)?.nom || className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[200px]">
                <Select 
                  value={selectedMatiere} 
                  onValueChange={handleMatiereChange}
                  disabled={!selectedClass}
                >
                  <SelectTrigger className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 focus:ring-blue-500">
                    <SelectValue placeholder="Sélectionner une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {matieresDisponibles.map((matiere) => (
                      <SelectItem key={matiere} value={matiere}>
                        {matiere}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                {selectedClass && selectedMatiere && (
                  <ImportNotesDialog 
                    onImportNotes={handleImportNotes}
                    selectedClass={selectedClass}
                    selectedMatiere={selectedMatiere}
                  />
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExport('excel')}
                  disabled={!selectedClass || !selectedMatiere}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExport('pdf')}
                  disabled={!selectedClass || !selectedMatiere}
                >
                  <File className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <NewNoteDialog 
                  onAddNote={handleAddNote} 
                  selectedClass={selectedClass} 
                  selectedMatiere={selectedMatiere}
                  matieresDisponibles={matieresDisponibles}
                />
              </div>
            </div>
          }
        />

        {selectedClass && selectedMatiere ? (
          <DataTable 
            columns={columns}
            data={filteredGroupedNotes}
            searchable={true}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            additionalFilters={
              <FilterNotesDialog onApplyFilters={handleApplyFilters} />
            }
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            Veuillez sélectionner une classe et une matière pour consulter les notes
          </div>
        )}
      </div>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette note ? 
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Notes;
