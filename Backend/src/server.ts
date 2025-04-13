import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
//import { getAllBulletins, getBulletinById } from '../controllers/bulletinController'; // Change to named import
import pool from './config/database'; // Ensure this path is correct
import { getAllBulletins, getBulletinById } from './controllers/bulletinController';
import elevesRoutes from './route/eleve';
import { fetchNotes } from './controllers/notesController';
import { getAllProfesseurs } from './controllers/professeurController';
import { getNotifications } from './controllers/notificationsController';
import { getCours } from './controllers/coursController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());

// Use the router
app.get('/api/bulletins', getAllBulletins); // Use the named export for the route
//app.get('/api/bulletins/:id', getBulletinById); // Use the named export for the route
app.use('/api/eleves', elevesRoutes);
app.get('/api/notes', fetchNotes);
app.get('/api/professeur', getAllProfesseurs);
app.get('/api/notifications', getNotifications);
app.get('/api/cours', getCours)

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

