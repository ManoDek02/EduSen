
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
import { Download, FileSpreadsheet, FilePdf } from 'lucide-react';

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

const Notes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>(notesMockData);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(notesMockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const handleAddNote = (newNote: Note) => {
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    applyFiltersAndSearch(updatedNotes, searchTerm, {});
  };

  const handleEditNote = (note: Note) => {
    // Dans une application réelle, cette fonction ouvrirait une boîte de dialogue d'édition
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
    applyFiltersAndSearch(updatedNotes, searchTerm, {});
    toast.success('Note supprimée avec succès');
    
    setConfirmDialogOpen(false);
    setNoteToDelete(null);
  };

  const handleApplyFilters = (filters) => {
    applyFiltersAndSearch(notes, searchTerm, filters);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSearch(notes, term, {});
  };

  const applyFiltersAndSearch = (data: Note[], term: string, filters: any) => {
    let result = [...data];

    // Appliquer les filtres
    if (filters.trimestre) {
      result = result.filter(note => note.trimestre === filters.trimestre);
    }

    if (filters.matiere) {
      result = result.filter(note => note.matiere === filters.matiere);
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

    // Appliquer la recherche
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

  // Configurer les colonnes du tableau
  const columns = getNotesColumns(handleEditNote, handleDeleteNote);

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Gestion des notes"
          description="Gérez les notes et évaluations des élèves"
          actions={
            <div className="flex flex-wrap gap-2">
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
                  <FilePdf className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </div>
              <NewNoteDialog onAddNote={handleAddNote} />
            </div>
          }
        />

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
