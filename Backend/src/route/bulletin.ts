import express from 'express';
import { getAllBulletins, getBulletinById } from '../controllers/bulletinController';

const router = express.Router();

router.get('/', getAllBulletins);
//router.get('/:id', getBulletinById);

export default router;
