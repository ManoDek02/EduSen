import pool from '@/config/database';
import { Bulletin, BulletinMatiere } from '@/types/bulletin';

export const getBulletins = async (): Promise<Bulletin[]> => {
  const query = `
    SELECT b.*, e.nom as eleve_nom, e.prenom as eleve_prenom
    FROM bulletins b
    JOIN eleves e ON b.eleve_id = e.id
  `;
  const result = await pool.query(query);
  return result.rows.map(row => ({
    ...row,
    eleveNom: row.eleve_nom,
    elevePrenom: row.eleve_prenom
  }));
};

export const getBulletinById = async (id: number): Promise<Bulletin | null> => {
  const client = await pool.connect();
  try {
    // Récupérer le bulletin
    const bulletinQuery = `
      SELECT b.*, e.nom as eleve_nom, e.prenom as eleve_prenom
      FROM bulletins b
      JOIN eleves e ON b.eleve_id = e.id
      WHERE b.id = $1
    `;
    const bulletinResult = await client.query(bulletinQuery, [id]);
    if (!bulletinResult.rows[0]) return null;

    // Récupérer les matières du bulletin
    const matieresQuery = `
      SELECT *
      FROM bulletin_matieres
      WHERE bulletin_id = $1
    `;
    const matieresResult = await client.query(matieresQuery, [id]);

    return {
      ...bulletinResult.rows[0],
      eleveNom: bulletinResult.rows[0].eleve_nom,
      elevePrenom: bulletinResult.rows[0].eleve_prenom,
      matieres: matieresResult.rows
    };
  } finally {
    client.release();
  }
};

export const createBulletin = async (bulletin: Omit<Bulletin, 'id'>): Promise<Bulletin> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Créer le bulletin
    const bulletinQuery = `
      INSERT INTO bulletins (
        eleve_id, trimestre, annee, moyenne_generale,
        moyenne_classe, appreciation_generale, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const bulletinResult = await client.query(bulletinQuery, [
      bulletin.eleveId,
      bulletin.trimestre,
      bulletin.annee,
      bulletin.moyenneGenerale,
      bulletin.moyenneClasse,
      bulletin.appreciationGenerale,
      bulletin.status
    ]);

    // Créer les matières du bulletin
    for (const matiere of bulletin.matieres) {
      const matiereQuery = `
        INSERT INTO bulletin_matieres (
          bulletin_id, matiere, moyenne, moyenne_classe,
          appreciation, professeur
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await client.query(matiereQuery, [
        bulletinResult.rows[0].id,
        matiere.matiere,
        matiere.moyenne,
        matiere.moyenneClasse,
        matiere.appreciation,
        matiere.professeur
      ]);
    }

    await client.query('COMMIT');

    return {
      ...bulletinResult.rows[0],
      matieres: bulletin.matieres
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateBulletin = async (id: number, bulletin: Partial<Bulletin>): Promise<Bulletin> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Mettre à jour le bulletin
    const bulletinQuery = `
      UPDATE bulletins
      SET trimestre = COALESCE($1, trimestre),
          annee = COALESCE($2, annee),
          moyenne_generale = COALESCE($3, moyenne_generale),
          moyenne_classe = COALESCE($4, moyenne_classe),
          appreciation_generale = COALESCE($5, appreciation_generale),
          status = COALESCE($6, status),
          date_printed = COALESCE($7, date_printed)
      WHERE id = $8
      RETURNING *
    `;
    const bulletinResult = await client.query(bulletinQuery, [
      bulletin.trimestre,
      bulletin.annee,
      bulletin.moyenneGenerale,
      bulletin.moyenneClasse,
      bulletin.appreciationGenerale,
      bulletin.status,
      bulletin.datePrinted,
      id
    ]);

    // Mettre à jour les matières si fournies
    if (bulletin.matieres) {
      // Supprimer les anciennes matières
      await client.query('DELETE FROM bulletin_matieres WHERE bulletin_id = $1', [id]);

      // Ajouter les nouvelles matières
      for (const matiere of bulletin.matieres) {
        const matiereQuery = `
          INSERT INTO bulletin_matieres (
            bulletin_id, matiere, moyenne, moyenne_classe,
            appreciation, professeur
          )
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
        await client.query(matiereQuery, [
          id,
          matiere.matiere,
          matiere.moyenne,
          matiere.moyenneClasse,
          matiere.appreciation,
          matiere.professeur
        ]);
      }
    }

    await client.query('COMMIT');

    return {
      ...bulletinResult.rows[0],
      matieres: bulletin.matieres || []
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteBulletin = async (id: number): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Supprimer les matières du bulletin
    await client.query('DELETE FROM bulletin_matieres WHERE bulletin_id = $1', [id]);

    // Supprimer le bulletin
    await client.query('DELETE FROM bulletins WHERE id = $1', [id]);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const filterBulletins = async (filters: {
  eleveId?: number;
  trimestre?: number;
  annee?: string;
  status?: string[];
}): Promise<Bulletin[]> => {
  let query = `
    SELECT b.*, e.nom as eleve_nom, e.prenom as eleve_prenom
    FROM bulletins b
    JOIN eleves e ON b.eleve_id = e.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.eleveId) {
    query += ` AND b.eleve_id = $${paramIndex}`;
    params.push(filters.eleveId);
    paramIndex++;
  }

  if (filters.trimestre) {
    query += ` AND b.trimestre = $${paramIndex}`;
    params.push(filters.trimestre);
    paramIndex++;
  }

  if (filters.annee) {
    query += ` AND b.annee = $${paramIndex}`;
    params.push(filters.annee);
    paramIndex++;
  }

  if (filters.status && filters.status.length > 0) {
    query += ` AND b.status = ANY($${paramIndex})`;
    params.push(filters.status);
    paramIndex++;
  }

  const result = await pool.query(query, params);
  return result.rows.map(row => ({
    ...row,
    eleveNom: row.eleve_nom,
    elevePrenom: row.eleve_prenom
  }));
}; 