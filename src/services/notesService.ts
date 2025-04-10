import { Pool } from 'mysql2/promise';
import pool from '../config/database';

export interface Note {
  id: number;
  eleve_id: number;
  eleveId: number;
  eleveNom: string;
  elevePrenom: string;
  matiere_id: number;
  matiere: string;
  note_1: number;
  note_2: number;
  coefficient: number;
  date: string;
  dateEvaluation: string;

  semestre: number;
  classe: string;
  professeur: string;
  professeurId: number;
  type: string;
  commentaire?: string;
  created_at?: string;
  updated_at?: string;

}

export const getNotes = async (): Promise<Note[]> => {
  const query = `
    SELECT 
      n.*,
      n.eleve_id as eleveId,
      u.nom as eleveNom,
      u.prenom as elevePrenom,
      p.id as professeurId,
      CONCAT(p.prenom, ' ', p.nom) as professeur,
      e.classe,
      m.nom as matiere,
      m.coefficient,
      DATE_FORMAT(n.date, '%Y-%m-%d') as date,
      DATE_FORMAT(n.date, '%Y-%m-%d') as date,
      DATE_FORMAT(n.date, '%Y-%m-%d') as dateEvaluation,
      DATE_FORMAT(n.created_at, '%Y-%m-%d') as created_at,
      DATE_FORMAT(n.updated_at, '%Y-%m-%d') as updated_at


    FROM notes n
    JOIN eleves e ON n.eleve_id = e.id
    JOIN users u ON e.user_id = u.id
    JOIN professeurs p ON n.professeur_id = p.id
    JOIN matieres m ON n.matiere_id = m.id
    ORDER BY n.date DESC
  `;
  const [result] = await pool.query(query);
  return result as Note[];
};




export const getNotesByClasse = async (classeId: number): Promise<Note[]> => {
  const query = `
    SELECT n.* 
    FROM notes n
    JOIN eleves e ON n.eleve_id = e.id
    WHERE e.classe = ?
    ORDER BY n.date DESC
  `;
  const [result] = await pool.query(query, [classeId]);
  return result as Note[];
};

export const updateNote = async (noteId: number, updates: Partial<Note>): Promise<void> => {
  const { note_1, note_2, commentaire } = updates;
  const query = `
    UPDATE notes
    SET 
      ${note_1 !== undefined ? 'note_1 = ?, ' : ''}
      ${note_2 !== undefined ? 'note_2 = ?, ' : ''}
      ${commentaire !== undefined ? 'commentaire = ?, ' : ''}
      updated_at = NOW()
    WHERE id = ?
  `;
  const params = [
    ...(note_1 !== undefined ? [note_1] : []),
    ...(note_2 !== undefined ? [note_2] : []),
    ...(commentaire !== undefined ? [commentaire] : []),
    noteId
  ].filter(Boolean);

  await pool.query(query, params);
};

export const createNote = async (newNote: Omit<Note, 'id'>): Promise<Note> => {
  const query = `
    INSERT INTO notes 
    (eleve_id, matiere_id, note_1, note_2, date, commentaire)
    VALUES (?, ?, ?, ?, ?, ?)
    RETURNING 
      id,
      eleve_id,
      eleve_id as eleveId,
      professeur_id as professeurId,
      matiere_id,
      note_1,
      note_2,
      coefficient,
      DATE_FORMAT(date, '%Y-%m-%d') as date,
      DATE_FORMAT(date, '%Y-%m-%d') as dateEvaluation,
      semestre,
      type,
      commentaire,
      DATE_FORMAT(created_at, '%Y-%m-%d') as created_at,
      DATE_FORMAT(updated_at, '%Y-%m-%d') as updated_at

  `;
  const [result] = await pool.query(query, [
    newNote.eleve_id,
    newNote.matiere_id,
    newNote.note_1,
    newNote.note_2,
    newNote.date,
    newNote.commentaire
  ]);
  return result[0] as Note;
};
