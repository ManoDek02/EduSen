import express from 'express';
import dotenv from 'dotenv';
import bulletinRoutes from './routes/bulletin'; // 👈 on importe le router ici

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 👇 ici on utilise le router
app.use('/api/bulletin', bulletinRoutes);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
