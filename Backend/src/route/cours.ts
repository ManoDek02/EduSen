import express from 'express';
import {
  getCours,
  updateCours,
  deleteCours,
} from '../controllers/coursController';

const router = express.Router();

// GET /api/cours — Liste tous les cours
router.get('/', getCours);

// PUT /api/cours/:id — Modifier un cours
router.put('/:id', updateCours);

// DELETE /api/cours/:id — Supprimer un cours
router.delete('/:id', deleteCours);

export default router;
