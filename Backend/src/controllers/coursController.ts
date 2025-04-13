import { Request, Response } from 'express';
import pool from '../config/database'; // Connexion MySQL

export const getCours = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cours');
    res.json(rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des cours :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getCoursById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM cours WHERE id = ?', [id]);
    const cours = Array.isArray(rows) ? rows[0] : null;

    if (!cours) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    res.json(cours);
  } catch (err) {
    console.error('Erreur lors de la récupération du cours :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const createCours = async (req: Request, res: Response) => {
  const { nom, enseignant } = req.body;

  if (!nom || !enseignant) {
    return res.status(400).json({ error: 'Nom et enseignant requis' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO cours (nom, enseignant) VALUES (?, ?)',
      [nom, enseignant]
    );
    const newCours = {
      id: (result as any).insertId,
      nom,
      enseignant,
    };
    res.status(201).json(newCours);
  } catch (err) {
    console.error('Erreur lors de la création du cours :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const updateCours = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nom, enseignant } = req.body;

  try {
    await pool.query(
      'UPDATE cours SET nom = ?, enseignant = ? WHERE id = ?',
      [nom, enseignant, id]
    );
    res.json({ message: 'Cours mis à jour avec succès' });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du cours :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const deleteCours = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM cours WHERE id = ?', [id]);
    res.json({ message: 'Cours supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du cours :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
