import pool from '@/config/database';
import { Eleve } from '@/types/eleve';

export const getEleves = async (): Promise<Eleve[]> => {
  const query = `
    SELECT e.*, u.nom, u.prenom, u.email
    FROM eleves e
    JOIN users u ON e.user_id = u.id
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const getEleveById = async (id: number): Promise<Eleve | null> => {
  const query = `
    SELECT e.*, u.nom, u.prenom, u.email
    FROM eleves e
    JOIN users u ON e.user_id = u.id
    WHERE e.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const createEleve = async (eleve: Omit<Eleve, 'id'>): Promise<Eleve> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Créer l'utilisateur
    const userQuery = `
      INSERT INTO users (matricule, email, nom, prenom, role, password_hash)
      VALUES ($1, $2, $3, $4, 'eleve', $5)
      RETURNING id
    `;
    const userResult = await client.query(userQuery, [
      eleve.matricule,
      eleve.email,
      eleve.nom,
      eleve.prenom,
      eleve.password_hash
    ]);

    // Créer l'élève
    const eleveQuery = `
      INSERT INTO eleves (user_id, classe, date_naissance, responsable, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const eleveResult = await client.query(eleveQuery, [
      userResult.rows[0].id,
      eleve.classe,
      eleve.dateNaissance,
      eleve.responsable,
      eleve.status
    ]);

    await client.query('COMMIT');

    return {
      ...eleveResult.rows[0],
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
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Mettre à jour l'utilisateur
    if (eleve.nom || eleve.prenom || eleve.email) {
      const userQuery = `
        UPDATE users
        SET nom = COALESCE($1, nom),
            prenom = COALESCE($2, prenom),
            email = COALESCE($3, email)
        FROM eleves
        WHERE users.id = eleves.user_id AND eleves.id = $4
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
      SET classe = COALESCE($1, classe),
          date_naissance = COALESCE($2, date_naissance),
          responsable = COALESCE($3, responsable),
          status = COALESCE($4, status)
      WHERE id = $5
      RETURNING *
    `;
    const result = await client.query(eleveQuery, [
      eleve.classe,
      eleve.dateNaissance,
      eleve.responsable,
      eleve.status,
      id
    ]);

    await client.query('COMMIT');

    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteEleve = async (id: number): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Supprimer l'élève
    const eleveQuery = 'DELETE FROM eleves WHERE id = $1 RETURNING user_id';
    const result = await client.query(eleveQuery, [id]);

    // Supprimer l'utilisateur associé
    if (result.rows[0]) {
      await client.query('DELETE FROM users WHERE id = $1', [result.rows[0].user_id]);
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

  const result = await pool.query(query, params);
  return result.rows;
};
