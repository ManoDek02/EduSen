import React, { useState } from 'react';
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
import { Download, FileSpreadsheet, File } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { matieres } from '@/components/notes/form/NoteFormSchema';

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

  // Extraire les classes uniques des notes
  const classes = Array.from(new Set(notes.map(note => note.classe))).sort();

  const handleAddNote = (newNote: Note) => {
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    applyFiltersAndSearch(updatedNotes, searchTerm, { classe: selectedClass, matiere: selectedMatiere });
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    toast.info("Fonctionnalité d'édition à implémenter");
  };

  const handleDeleteNote = (note: Note) => {
    setNoteToDelete(note);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!noteToDelete) return;
    
    const updatedNotes = notes.filter(n => n.id !== noteToDelete.id);
    setNotes(updatedNotes);
    applyFiltersAndSearch(updatedNotes, searchTerm, { classe: selectedClass, matiere: selectedMatiere });
    toast.success('Note supprimée avec succès');
    
    setConfirmDialogOpen(false);
    setNoteToDelete(null);
  };

  const handleApplyFilters = (filters) => {
    applyFiltersAndSearch(notes, searchTerm, { ...filters, classe: selectedClass, matiere: selectedMatiere });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSearch(notes, term, { classe: selectedClass, matiere: selectedMatiere });
  };

  const handleClassChange = (classe: string) => {
    setSelectedClass(classe);
    applyFiltersAndSearch(notes, searchTerm, { classe, matiere: selectedMatiere });
  };

  const handleMatiereChange = (matiere: string) => {
    setSelectedMatiere(matiere);
    applyFiltersAndSearch(notes, searchTerm, { classe: selectedClass, matiere });
  };

  const applyFiltersAndSearch = (data: Note[], term: string, filters: any) => {
    let result = [...data];

    // Filtrer par classe
    if (filters.classe) {
      result = result.filter(note => note.classe === filters.classe);
    }

    // Filtrer par matière
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

  const handleExport = (format) => {
    toast.success(`Export des notes en format ${format.toUpperCase()} effectué`);
  };

  // Get columns from NotesTableColumns and adapt them to the format DataTable expects
  const tanstackColumns = getNotesColumns(handleEditNote, handleDeleteNote);
  const columns = adaptColumns(tanstackColumns);

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Gestion des notes"
          description="Gérez les notes et évaluations des élèves"
          actions={
            <div className="flex flex-wrap gap-2">
              <div className="w-[200px]">
                <Select value={selectedClass} onValueChange={handleClassChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[200px]">
                <Select value={selectedMatiere} onValueChange={handleMatiereChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {matieres.map((matiere) => (
                      <SelectItem key={matiere} value={matiere}>
                        {matiere}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center">
                <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
              <div className="flex items-center">
                <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </div>
              <div className="flex items-center">
                <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                  <File className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </div>
              <NewNoteDialog onAddNote={handleAddNote} selectedClass={selectedClass} selectedMatiere={selectedMatiere} />
            </div>
          }
        />

        {selectedClass && selectedMatiere ? (
          <DataTable 
            columns={columns}
            data={filteredNotes}
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
