import { Pool } from 'mysql2/promise';
import pool from '@/config/database';
import { Note } from '@/types/note';

export const getNotes = async (): Promise<Note[]> => {
  const query = `
    SELECT n.*, e.nom as eleve_nom, e.prenom as eleve_prenom, p.nom as professeur_nom, p.prenom as professeur_prenom
    FROM notes n
    JOIN eleves e ON n.eleve_id = e.id
    JOIN professeurs p ON n.professeur_id = p.id
  `;
  const [result] = await pool.query(query);
  return result as Note[];
};

export const getNoteById = async (id: number): Promise<Note | null> => {
  const query = `
    SELECT n.*, e.nom as eleve_nom, e.prenom as eleve_prenom, p.nom as professeur_nom, p.prenom as professeur_prenom
    FROM notes n
    JOIN eleves e ON n.eleve_id = e.id
    JOIN professeurs p ON n.professeur_id = p.id
    WHERE n.id = $1
  `;
  const [result] = await pool.query(query, [id]);
  if (!result[0]) return null;
  
  const row = result[0];
  return {
    ...row,
    eleveNom: row.eleve_nom,
    elevePrenom: row.eleve_prenom,
    professeur: `${row.professeur_prenom} ${row.professeur_nom}`
  };
};

export const createNote = async (note: Omit<Note, 'id'>): Promise<Note> => {
  const query = `
    INSERT INTO notes (
      eleve_id, professeur_id, matiere, note, coefficient,
      trimestre, date_evaluation, commentaire, type
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  const [result] = await pool.query(query, [
    note.eleveId,
    note.professeurId,
    note.matiere,
    note.note_1,
    note.note_2,
    note.semestre,
    note.dateEvaluation,
    note.commentaire,
    note.type
  ]);
  return result[0];
};

export const updateNote = async (id: number, note: Partial<Note>): Promise<Note> => {
  const query = `
    UPDATE notes
    SET matiere = COALESCE($1, matiere),
        note = COALESCE($2, note),
        coefficient = COALESCE($3, coefficient),
        trimestre = COALESCE($4, trimestre),
        date_evaluation = COALESCE($5, date_evaluation),
        commentaire = COALESCE($6, commentaire),
        type = COALESCE($7, type)
    WHERE id = $8
    RETURNING *
  `;
  const [result] = await pool.query(query, [
    note.matiere,
    note.note_1,
    note.note_2,
    note.semestre,
    note.dateEvaluation,
    note.commentaire,
    note.type,
    id
  ]);
  return result[0];
};

export const deleteNote = async (id: number): Promise<void> => {
  const query = 'DELETE FROM notes WHERE id = $1';
  await pool.query(query, [id]);
};

export const filterNotes = async (filters: {
  eleveId?: number;
  professeurId?: number;
  matiere?: string;
  trimestre?: number;
  dateDebut?: string;
  dateFin?: string;
}): Promise<Note[]> => {
  let query = `
    SELECT n.*, e.nom as eleve_nom, e.prenom as eleve_prenom, p.nom as professeur_nom, p.prenom as professeur_prenom
    FROM notes n
    JOIN eleves e ON n.eleve_id = e.id
    JOIN professeurs p ON n.professeur_id = p.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.eleveId) {
    query += ` AND n.eleve_id = $${paramIndex}`;
    params.push(filters.eleveId);
    paramIndex++;
  }

  if (filters.professeurId) {
    query += ` AND n.professeur_id = $${paramIndex}`;
    params.push(filters.professeurId);
    paramIndex++;
  }

  if (filters.matiere) {
    query += ` AND n.matiere = $${paramIndex}`;
    params.push(filters.matiere);
    paramIndex++;
  }

  if (filters.trimestre) {
    query += ` AND n.trimestre = $${paramIndex}`;
    params.push(filters.trimestre);
    paramIndex++;
  }

  if (filters.dateDebut) {
    query += ` AND n.date_evaluation >= $${paramIndex}`;
    params.push(filters.dateDebut);
    paramIndex++;
  }

  if (filters.dateFin) {
    query += ` AND n.date_evaluation <= $${paramIndex}`;
    params.push(filters.dateFin);
    paramIndex++;
  }

  const [result] = await pool.query(query, params);
  return result as Note[];
}; 