// backend/controllers/bulletin.controller.ts
import { Request, Response } from 'express';
import pool from '../config/database';

export const getAllBulletins = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, e.nom as eleve_nom, e.prenom as eleve_prenom
      FROM bulletins b
      JOIN eleves e ON b.eleve_id = e.id
    `);
    const bulletins = (rows as any[]).map(row => ({
      ...row,
      eleveNom: row.eleve_nom,
      elevePrenom: row.eleve_prenom
    }));
    res.json(bulletins);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des bulletins' });
  }
};

export const getBulletinById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const client = await pool.getConnection();
  try {
    const [bulletinRows] = await client.query(`
      SELECT b.*, e.nom as eleve_nom, e.prenom as eleve_prenom
      FROM bulletins b
      JOIN eleves e ON b.eleve_id = e.id
      WHERE b.id = ?
    `, [id]);
    if (!bulletinRows[0]) return res.status(404).json({ error: 'Bulletin non trouvé' });

    const [matieresRows] = await client.query(`SELECT * FROM bulletin_matieres WHERE bulletin_id = ?`, [id]);

    res.json({
      ...bulletinRows[0],
      eleveNom: bulletinRows[0].eleve_nom,
      elevePrenom: bulletinRows[0].eleve_prenom,
      matieres: matieresRows
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur interne' });
  } finally {
    client.release();
  }
};
