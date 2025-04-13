import express from 'express';
import cors from 'cors';

import coursRoutes from './src/route/cours';
import bulletinRoutes from './src/route/bulletin';
import notificationRoutes from './src/route/notificationsRoute';
import eleveRoutes from './src/route/eleve';
import professeurRoutes from './src/route/professeur';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Utilisation des routeurs (PAS les fonctions directes !)
app.use('/api/cours', coursRoutes);
app.use('/api/bulletin', bulletinRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/eleves', eleveRoutes);
app.use('/api/professeur', professeurRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
