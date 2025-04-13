// Backend/src/controller/notesController.ts
import { Request, Response } from 'express';
import {
  getNotes,
  getNotesByClasse,
  updateNote,
  createNote
} from '../api/notes';

export const fetchNotes = async (_req: Request, res: Response) => {
  try {
    const notes = await getNotes();
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du chargement des notes' });
  }
};

export const fetchNotesByClasse = async (req: Request, res: Response) => {
  try {
    const { classeId } = req.params;
    const notes = await getNotesByClasse(Number(classeId));
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des notes de classe' });
  }
};

export const modifyNote = async (req: Request, res: Response) => {
  try {
    const noteId = Number(req.params.id);
    await updateNote(noteId, req.body);
    res.status(200).json({ message: 'Note mise à jour avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la note' });
  }
};

export const addNote = async (req: Request, res: Response) => {
  try {
    const newNote = await createNote(req.body);
    res.status(201).json(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de la note' });
  }
};
