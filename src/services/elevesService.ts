import { Pool } from 'mysql2/promise';
import pool from '@/config/database';
import { Eleve } from '@/types/eleve';

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

    // Créer l'utilisateur
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

    // Créer l'élève
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

export const updateEleve = async (id: number, eleve: Partial<Eleve>): Promise<Eleve> => {
  const client = await pool.getConnection();
  try {
    await client.query('BEGIN');

    // Mettre à jour l'utilisateur
    if (eleve.nom || eleve.prenom || eleve.email) {
      const userQuery = `
        UPDATE users
        SET nom = COALESCE(?, nom),
            prenom = COALESCE(?, prenom),
            email = COALESCE(?, email)
        FROM eleves
        WHERE users.id = eleves.user_id AND eleves.id = ?
      `;
      await client.query(userQuery, [
        eleve.nom,
        eleve.prenom,
        eleve.email,
        id
      ]);
    }

    // Mettre à jour l'élève
    const eleveQuery = `
      UPDATE eleves
      SET classe = COALESCE(?, classe),
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

    return result[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteEleve = async (id: number): Promise<void> => {
  const client = await pool.getConnection();
  try {
    await client.query('BEGIN');

    // Supprimer l'élève
    const eleveQuery = 'DELETE FROM eleves WHERE id = ? RETURNING user_id';
    const [result] = await client.query(eleveQuery, [id]);

    // Supprimer l'utilisateur associé
    if (result[0]) {
      await client.query('DELETE FROM users WHERE id = ?', [result[0].user_id]);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const filterEleves = async (filters: {
  status?: string[];
  classe?: string;
  searchTerm?: string;
}): Promise<Eleve[]> => {
  let query = `
    SELECT e.*, u.nom, u.prenom, u.email
    FROM eleves e
    JOIN users u ON e.user_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.status && filters.status.length > 0) {
    query += ` AND e.status = ANY($${paramIndex})`;
    params.push(filters.status);
    paramIndex++;
  }

  if (filters.classe) {
    query += ` AND e.classe = $${paramIndex}`;
    params.push(filters.classe);
    paramIndex++;
  }

  if (filters.searchTerm) {
    query += ` AND (
      u.nom ILIKE $${paramIndex} OR
      u.prenom ILIKE $${paramIndex} OR
      u.email ILIKE $${paramIndex}
    )`;
    params.push(`%${filters.searchTerm}%`);
  }

  const [result] = await pool.query(query, params);
  return result as Eleve[];
};
