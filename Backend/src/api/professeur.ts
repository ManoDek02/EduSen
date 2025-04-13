// Backend/src/api/professeur.ts
import pool from '../config/database';

export const getProfesseurs = async () => {
  const query = `
    SELECT p.*, u.nom, u.prenom, u.email
    FROM professeurs p
    JOIN users u ON p.user_id = u.id
  `;
  const [rows] = await pool.query(query);
  return rows;
};

export const getProfesseurById = async (id: number) => {
  const query = `
    SELECT p.*, u.nom, u.prenom, u.email
    FROM professeurs p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `;
  const [rows] = await pool.query(query, [id]);
  return (rows as any[])[0] || null;
};

export const createProfesseur = async (professeur: any) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [userResult]: any = await conn.query(`
      INSERT INTO users (matricule, email, nom, prenom, role, password_hash)
      VALUES (?, ?, ?, ?, 'professeur', ?)
    `, [
      professeur.matricule,
      professeur.email,
      professeur.nom,
      professeur.prenom,
      professeur.password_hash
    ]);

    const userId = userResult.insertId;

    const [professeurResult]: any = await conn.query(`
      INSERT INTO professeurs (user_id, matiere, telephone, status)
      VALUES (?, ?, ?, ?)
    `, [
      userId,
      professeur.matiere,
      professeur.telephone,
      professeur.status
    ]);

    await conn.commit();
    return { ...professeurResult, nom: professeur.nom, prenom: professeur.prenom, email: professeur.email };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const updateProfesseur = async (id: number, professeur: any) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    if (professeur.nom || professeur.prenom || professeur.email) {
      await conn.query(`
        UPDATE users
        SET nom = COALESCE(?, nom),
            prenom = COALESCE(?, prenom),
            email = COALESCE(?, email)
        WHERE id = (SELECT user_id FROM professeurs WHERE id = ?)
      `, [professeur.nom, professeur.prenom, professeur.email, id]);
    }

    const [rows]: any = await conn.query(`
      UPDATE professeurs
      SET matiere = COALESCE(?, matiere),
          telephone = COALESCE(?, telephone),
          status = COALESCE(?, status)
      WHERE id = ?
    `, [professeur.matiere, professeur.telephone, professeur.status, id]);

    await conn.commit();
    return rows;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const deleteProfesseur = async (id: number) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows]: any = await conn.query(`DELETE FROM professeurs WHERE id = ? RETURNING user_id`, [id]);
    const userId = rows[0]?.user_id;
    if (userId) {
      await conn.query(`DELETE FROM users WHERE id = ?`, [userId]);
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const filterProfesseurs = async (filters: any) => {
  let query = `
    SELECT p.*, u.nom, u.prenom, u.email
    FROM professeurs p
    JOIN users u ON p.user_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters.status?.length) {
    query += ` AND p.status IN (${filters.status.map(() => '?').join(',')})`;
    params.push(...filters.status);
  }

  if (filters.matiere) {
    query += ` AND p.matiere = ?`;
    params.push(filters.matiere);
  }

  if (filters.searchTerm) {
    query += ` AND (u.nom LIKE ? OR u.prenom LIKE ? OR u.email LIKE ?)`;
    params.push(`%${filters.searchTerm}%`, `%${filters.searchTerm}%`, `%${filters.searchTerm}%`);
  }

  const [rows] = await pool.query(query, params);
  return rows;
};
