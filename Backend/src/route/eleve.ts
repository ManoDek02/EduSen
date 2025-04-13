import express from 'express';
import {
  getEleves,
  getEleve,
  postEleve,
  putEleve,
  removeEleve,
  postFilterEleves
} from '../api/eleve';

const router = express.Router();

router.get('/', getEleves);
router.get('/:id', getEleve);
router.post('/', postEleve);
router.put('/:id', putEleve);
router.delete('/:id', removeEleve);
router.post('/filter', postFilterEleves);

export default router;
