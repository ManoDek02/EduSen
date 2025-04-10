import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { EditNoteButton } from "./EditNoteButton";
import { toast } from "sonner";

interface Note {
  id: string;
  eleve: string;
  classe: string;
  matiere: string;
  note_1: number;
  note_2: number;
  date: string;
}

export const NotesManagement = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      // TODO: Remplacer par l'appel API réel
      const response = await fetch('/api/notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des notes");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNote = async (noteId: string, newNote: number) => {
    // TODO: Remplacer par l'appel API réel
    await fetch(`/api/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note: newNote }),
    });
    
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, note: newNote } : note
    ));
  };

  const filteredNotes = notes.filter(note =>
    note.eleve.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.classe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.matiere.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Notes</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter size={16} className="mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Élève</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Matière</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : filteredNotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Aucune note trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>{note.eleve}</TableCell>
                  <TableCell>{note.classe}</TableCell>
                  <TableCell>{note.matiere}</TableCell>
                  <TableCell>{note.note_1}/20</TableCell>
                  <TableCell>{note.note_2}/20</TableCell>
                  <TableCell>{new Date(note.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <EditNoteButton
                      noteId={note.id}
                      currentNote_1={note.note_1}
                      currentNote_2={note.note_1}
                      onUpdate={handleUpdateNote}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}; 