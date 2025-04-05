import pool from '@/config/database';
import { Cours } from '@/types/cours';

export const getCours = async (): Promise<Cours[]> => {
  const query = `
    SELECT c.*, p.nom as professeur_nom, p.prenom as professeur_prenom
    FROM cours c
    JOIN professeurs p ON c.professeur_id = p.id
  `;
  const [result] = await pool.query(query);
  return result.map(row => ({
    ...row,
    professeur: `${row.professeur_prenom} ${row.professeur_nom}`
  })) as Cours[];
};

export const getCoursById = async (id: number): Promise<Cours | null> => {
  const query = `
    SELECT c.*, p.nom as professeur_nom, p.prenom as professeur_prenom
    FROM cours c
    JOIN professeurs p ON c.professeur_id = p.id
    WHERE c.id = $1
  `;
  const [result] = await pool.query(query, [id]);
  if (!result[0]) return null;
  
  const row = result[0];
  return {
    ...row,
    professeur: `${row.professeur_prenom} ${row.professeur_nom}`
  };
};

export const createCours = async (cours: Omit<Cours, 'id'>): Promise<Cours> => {
  const query = `
    INSERT INTO cours (
      classe, matiere, professeur_id, salle,
      jour, debut, duree, couleur
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  const [result] = await pool.query(query, [
    cours.classe,
    cours.matiere,
    cours.professeurId,
    cours.salle,
    cours.jour,
    cours.debut,
    cours.duree,
    cours.couleur
  ]);
  return result[0];
};

export const updateCours = async (id: number, cours: Partial<Cours>): Promise<Cours> => {
  const query = `
    UPDATE cours
    SET classe = COALESCE($1, classe),
        matiere = COALESCE($2, matiere),
        professeur_id = COALESCE($3, professeur_id),
        salle = COALESCE($4, salle),
        jour = COALESCE($5, jour),
        debut = COALESCE($6, debut),
        duree = COALESCE($7, duree),
        couleur = COALESCE($8, couleur)
    WHERE id = $9
    RETURNING *
  `;
  const [result] = await pool.query(query, [
    cours.classe,
    cours.matiere,
    cours.professeurId,
    cours.salle,
    cours.jour,
    cours.debut,
    cours.duree,
    cours.couleur,
    id
  ]);
  return result[0];
};

export const deleteCours = async (id: number): Promise<void> => {
  const query = 'DELETE FROM cours WHERE id = $1';
  await pool.query(query, [id]);
};

export const filterCours = async (filters: {
  classe?: string;
  professeurId?: number;
  jour?: number;
  matiere?: string;
}): Promise<Cours[]> => {
  let query = `
    SELECT c.*, p.nom as professeur_nom, p.prenom as professeur_prenom
    FROM cours c
    JOIN professeurs p ON c.professeur_id = p.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.classe) {
    query += ` AND c.classe = $${paramIndex}`;
    params.push(filters.classe);
    paramIndex++;
  }

  if (filters.professeurId) {
    query += ` AND c.professeur_id = $${paramIndex}`;
    params.push(filters.professeurId);
    paramIndex++;
  }

  if (filters.jour !== undefined) {
    query += ` AND c.jour = $${paramIndex}`;
    params.push(filters.jour);
    paramIndex++;
  }

  if (filters.matiere) {
    query += ` AND c.matiere = $${paramIndex}`;
    params.push(filters.matiere);
    paramIndex++;
  }

  const [result] = await pool.query(query, params);
  return result.map(row => ({
    ...row,
    professeur: `${row.professeur_prenom} ${row.professeur_nom}`
  })) as Cours[];
}; 