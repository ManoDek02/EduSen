// Backend/src/route/notes.ts
import express from 'express';
import {
  fetchNotes,
  fetchNotesByClasse,
  modifyNote,
  addNote
} from '../controllers/notesController';

const router = express.Router();

router.get('/', fetchNotes);
router.get('/classe/:classeId', fetchNotesByClasse);
router.put('/:id', modifyNote);
router.post('/', addNote);

export default router;
