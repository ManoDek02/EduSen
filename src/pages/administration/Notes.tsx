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
import { EditNoteDialog } from '@/components/notes/EditNoteDialog';
import FilterNotesDialog from '@/components/notes/FilterNotesDialog';
import ImportNotesDialog from '@/components/notes/ImportNotesDialog';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, File } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { jsPDF as JSPDFType } from 'jspdf';

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

interface NoteFilters {
  trimestre?: number;
  matiere?: string;
  typesEvaluation?: string[];
  noteRange?: {
    min?: number;
    max?: number;
  };
  classe?: string;
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("");
  const [matieresDisponibles, setMatieresDisponibles] = useState<string[]>([]);

  const handleAddNote = (newNote: Note) => {
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    applyFiltersAndSearch(updatedNotes, searchTerm, {});
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setEditDialogOpen(true);
  };

  const handleSaveNote = async (updatedNote: Note) => {
    try {
      // TODO: Remplacer par l'appel API réel
      const response = await fetch(`/api/notes/${updatedNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la note');
      }

      const updatedNotes = notes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      );
      setNotes(updatedNotes);
      applyFiltersAndSearch(updatedNotes, searchTerm, {});
    } catch (error) {
      console.error(error);
      throw error;
    }
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

  const applyFiltersAndSearch = (data: Note[], term: string, filters: NoteFilters) => {
    let result = [...data];

    if (filters.classe) {
      result = result.filter(note => note.classe === filters.classe);
    }

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

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (!filteredNotes.length) {
      toast.error("Aucune note à exporter");
      return;
    }

    try {
      // Préparer les données pour l'export
      const exportData = filteredNotes.map(note => ({
        'ID Élève': note.eleveId,
        'Nom': note.eleveNom,
        'Prénom': note.elevePrenom,
        'Classe': note.classe,
        'Matière': note.matiere,
        'Note': note.note,
        'Coefficient': note.coefficient,
        'Professeur': note.professeur,
        'Trimestre': note.trimestre,
        'Date': note.dateEvaluation,
        'Type': note.type,
        'Commentaire': note.commentaire
      }));

      if (format === 'excel' || format === 'csv') {
        // Créer un nouveau classeur Excel
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Notes');

        // Ajuster la largeur des colonnes
        const colWidths = Object.keys(exportData[0]).map(key => ({
          wch: Math.max(key.length, ...exportData.map(row => String(row[key]).length))
        }));
        ws['!cols'] = colWidths;

        // Exporter le fichier
        XLSX.writeFile(wb, `notes_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`);
      } else if (format === 'pdf') {
        // Créer un nouveau document PDF
        const doc = new jsPDF() as JSPDFType & { autoTable: (options: any) => void };
        
        // Ajouter un titre
        doc.setFontSize(16);
        doc.text('Bulletin de notes', 14, 15);
        doc.setFontSize(10);
        doc.text(`Date d'export: ${new Date().toLocaleDateString()}`, 14, 22);

        // Configurer le tableau
        doc.autoTable({
          head: [Object.keys(exportData[0])],
          body: exportData.map(Object.values),
          startY: 30,
          theme: 'grid',
          styles: {
            fontSize: 8,
            cellPadding: 2
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          }
        });

        // Ajouter un pied de page
        const pageCount = doc.internal.pages.length;
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
        doc.save(`notes_${new Date().toISOString().split('T')[0]}.pdf`);
      }

      toast.success(`Export des notes en format ${format.toUpperCase()} effectué avec succès`);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error(`Erreur lors de l'export en format ${format.toUpperCase()}`);
    }
  };

  const handleImportNotes = (newNotes: Note[]) => {
    const updatedNotes = [...notes, ...newNotes];
    setNotes(updatedNotes);
    applyFiltersAndSearch(updatedNotes, searchTerm, {});
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
              <ImportNotesDialog 
                onImportNotes={handleImportNotes}
                selectedClass={selectedClass}
                selectedMatiere={selectedMatiere}
              />
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
              <NewNoteDialog 
                onAddNote={handleAddNote}
                selectedClass={selectedClass}
                selectedMatiere={selectedMatiere}
                matieresDisponibles={matieresDisponibles}
              />
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

      <EditNoteDialog
        note={selectedNote}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveNote}
      />
    </MainLayout>
  );
};

export default Notes;
