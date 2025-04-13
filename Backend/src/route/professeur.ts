// Backend/src/route/professeur.ts
import { Router } from 'express';
import * as professeurController from '../controllers/professeurController';

const router = Router();

router.get('/', professeurController.getAllProfesseurs);
router.get('/:id', professeurController.getProfesseur);
router.post('/', professeurController.create);
router.put('/:id', professeurController.update);
router.delete('/:id', professeurController.remove);
router.post('/filter', professeurController.filter);

export default router;
