import pool from '@/config/database';
import { Professeur } from '@/types/professeur';

export const getProfesseurs = async (): Promise<Professeur[]> => {
  const query = `
    SELECT p.*, u.nom, u.prenom, u.email
    FROM professeurs p
    JOIN users u ON p.user_id = u.id
  `;
  const [result] = await pool.query(query);
  return result.map(row => ({
    ...row,
    // Vous pouvez ajouter d'autres transformations si nécessaire
  })) as Professeur[];
};

export const getProfesseurById = async (id: number): Promise<Professeur | null> => {
  const query = `
    SELECT p.*, u.nom, u.prenom, u.email
    FROM professeurs p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = $1
  `;
  const [result] = await pool.query(query, [id]);
  return result[0] || null;
};

export const createProfesseur = async (professeur: Omit<Professeur, 'id'>): Promise<Professeur> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Créer l'utilisateur
    const userQuery = `
      INSERT INTO users (matricule, email, nom, prenom, role, password_hash)
      VALUES ($1, $2, $3, $4, 'professeur', $5)
      RETURNING id
    `;
    const [userResult] = await client.query(userQuery, [
      professeur.matricule,
      professeur.email,
      professeur.nom,
      professeur.prenom,
      professeur.password_hash
    ]);

    // Créer le professeur
    const professeurQuery = `
      INSERT INTO professeurs (user_id, matiere, telephone, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const [professeurResult] = await client.query(professeurQuery, [
      userResult[0].id,
      professeur.matiere,
      professeur.telephone,
      professeur.status
    ]);

    await client.query('COMMIT');

    return {
      ...professeurResult[0],
      nom: professeur.nom,
      prenom: professeur.prenom,
      email: professeur.email
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateProfesseur = async (id: number, professeur: Partial<Professeur>): Promise<Professeur> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Mettre à jour l'utilisateur
    if (professeur.nom || professeur.prenom || professeur.email) {
      const userQuery = `
        UPDATE users
        SET nom = COALESCE($1, nom),
            prenom = COALESCE($2, prenom),
            email = COALESCE($3, email)
        FROM professeurs
        WHERE users.id = professeurs.user_id AND professeurs.id = $4
      `;
      await client.query(userQuery, [
        professeur.nom,
        professeur.prenom,
        professeur.email,
        id
      ]);
    }

    // Mettre à jour le professeur
    const professeurQuery = `
      UPDATE professeurs
      SET matiere = COALESCE($1, matiere),
          telephone = COALESCE($2, telephone),
          status = COALESCE($3, status)
      WHERE id = $4
      RETURNING *
    `;
    const [result] = await client.query(professeurQuery, [
      professeur.matiere,
      professeur.telephone,
      professeur.status,
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

export const deleteProfesseur = async (id: number): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Supprimer le professeur
    const professeurQuery = 'DELETE FROM professeurs WHERE id = $1 RETURNING user_id';
    const result = await client.query(professeurQuery, [id]);

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

export const filterProfesseurs = async (filters: {
  status?: string[];
  matiere?: string;
  searchTerm?: string;
}): Promise<Professeur[]> => {
  let query = `
    SELECT p.*, u.nom, u.prenom, u.email
    FROM professeurs p
    JOIN users u ON p.user_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.status && filters.status.length > 0) {
    query += ` AND p.status = ANY($${paramIndex})`;
    params.push(filters.status);
    paramIndex++;
  }

  if (filters.matiere) {
    query += ` AND p.matiere = $${paramIndex}`;
    params.push(filters.matiere);
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
  return result.map(row => ({
    ...row,
    // Vous pouvez ajouter d'autres transformations si nécessaire
  })) as Professeur[];
}; 