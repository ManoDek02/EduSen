import pool from '../config/database';

// Interface déclarée directement ici
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

// GET all notes
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

// GET notes par classe
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

// UPDATE note
export const updateNote = async (noteId: number, updates: Partial<Note>): Promise<void> => {
  const { note_1, note_2, commentaire } = updates;
  const fields: string[] = [];
  const values: any[] = [];

  if (note_1 !== undefined) {
    fields.push('note_1 = ?');
    values.push(note_1);
  }
  if (note_2 !== undefined) {
    fields.push('note_2 = ?');
    values.push(note_2);
  }
  if (commentaire !== undefined) {
    fields.push('commentaire = ?');
    values.push(commentaire);
  }

  fields.push('updated_at = NOW()');
  values.push(noteId);

  const query = `UPDATE notes SET ${fields.join(', ')} WHERE id = ?`;
  await pool.query(query, values);
};

// CREATE note
export const createNote = async (newNote: Omit<Note, 'id'>): Promise<Note> => {
  const query = `
    INSERT INTO notes 
    (eleve_id, matiere_id, note_1, note_2, date, commentaire)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    newNote.eleve_id,
    newNote.matiere_id,
    newNote.note_1,
    newNote.note_2,
    newNote.date,
    newNote.commentaire
  ];
  const [result] = await pool.query(query, values);
  const insertId = (result as any).insertId;

  const [rows] = await pool.query(`SELECT * FROM notes WHERE id = ?`, [insertId]);
  return (rows as Note[])[0];
};
