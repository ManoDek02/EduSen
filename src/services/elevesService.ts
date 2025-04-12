import { Pool } from 'mysql2/promise';
import pool from '../../Backend/src/config/database';
import { Eleve } from '../types/eleve';

export const getEleves = async (): Promise<Eleve[]> => {
  const query = `
    SELECT e.*, u.nom, u.prenom, u.email
    FROM eleves e
    JOIN users u ON e.user_id = u.id
  `;
  const [result] = await pool.query(query);
  return result as Eleve[];
};

export const getEleveById = async (id: number): Promise<Eleve | null> => {
  const query = `
    SELECT e.*, u.nom, u.prenom, u.email
    FROM eleves e
    JOIN users u ON e.user_id = u.id
    WHERE e.id = ?
  `;
  const [result] = await pool.query(query, [id]);
  return result[0] as Eleve || null;
};

export const createEleve = async (eleve: Omit<Eleve, 'id'>): Promise<Eleve> => {
  const client = await pool.getConnection();
  try {
    await client.query('BEGIN');

    const userQuery = `
      INSERT INTO users (matricule, email, nom, prenom, role, password_hash)
      VALUES (?, ?, ?, ?, 'eleve', ?)
      RETURNING id
    `;
    const [userResult] = await client.query(userQuery, [
      eleve.matricule,
      eleve.email,
      eleve.nom,
      eleve.prenom,
      eleve.password_hash
    ]);

    const eleveQuery = `
      INSERT INTO eleves (user_id, classe, date_naissance, responsable, status)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `;
    const [eleveResult] = await client.query(eleveQuery, [
      userResult[0].id,
      eleve.classe,
      eleve.dateNaissance,
      eleve.responsable,
      eleve.status
    ]);

    await client.query('COMMIT');
    return {
      ...eleveResult[0],
      nom: eleve.nom,
      prenom: eleve.prenom,
      email: eleve.email
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const addEleve = async (newEleve: Omit<Eleve, 'id'>): Promise<Eleve> => {
  return createEleve(newEleve);
};

export const deleteEleve = async (id: number): Promise<void> => {
  const client = await pool.getConnection();
  try {
    await client.query('BEGIN');
    
    // D'abord supprimer l'élève
    await client.query('DELETE FROM eleves WHERE id = ?', [id]);
    
    // Puis supprimer l'utilisateur associé
    await client.query('DELETE FROM users WHERE id IN (SELECT user_id FROM eleves WHERE id = ?)', [id]);
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateEleve = async (id: number, eleve: Partial<Eleve>): Promise<Eleve> => {
  const client = await pool.getConnection();
  try {
    await client.query('BEGIN');

    // Update user table
    const userQuery = `
      UPDATE users
      SET 
        matricule = COALESCE(?, matricule),
        email = COALESCE(?, email),
        nom = COALESCE(?, nom),
        prenom = COALESCE(?, prenom)
      WHERE id IN (SELECT user_id FROM eleves WHERE id = ?)
    `;
    await client.query(userQuery, [
      eleve.matricule,
      eleve.email,
      eleve.nom,
      eleve.prenom,
      id
    ]);

    // Update eleve table
    const eleveQuery = `
      UPDATE eleves
      SET 
        classe = COALESCE(?, classe),
        date_naissance = COALESCE(?, date_naissance),
        responsable = COALESCE(?, responsable),
        status = COALESCE(?, status)
      WHERE id = ?
      RETURNING *
    `;
    const [result] = await client.query(eleveQuery, [
      eleve.classe,
      eleve.dateNaissance,
      eleve.responsable,
      eleve.status,
      id
    ]);

    await client.query('COMMIT');
    
    // Get the full updated record
    const updatedEleve = await getEleveById(id);
    if (!updatedEleve) throw new Error('Student not found after update');
    return updatedEleve;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const filterEleves = async (filters: {
  classe?: string;
}): Promise<Eleve[]> => {

  let query = `
    SELECT e.*, u.nom, u.prenom, u.email
    FROM eleves e
    JOIN users u ON e.user_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters.classe) {
    query += ` AND e.classe = ?`;
    params.push(filters.classe);
  }

  const [result] = await pool.query(query, params);
  return result as Eleve[];

  
};
