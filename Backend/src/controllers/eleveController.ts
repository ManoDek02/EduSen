import db from '../config/database';

interface Eleve {
  id: number;
  nom: string;
  prenom: string;
  classe: string;
  date_naissance: string;
  status: string;
  responsable: string;
  email: string;
  telephone: number;
  adresse: string
}

export const getAllEleves = async (): Promise<Eleve[]> => {
  const [rows] = await db.query('SELECT * FROM eleves');
  return rows as Eleve[];
};

export const getEleveById = async (id: number): Promise<Eleve | null> => {
  const [rows] = await db.query('SELECT * FROM eleves WHERE id = ?', [id]);
  const eleves = rows as Eleve[];
  return eleves[0] || null;
};

export const createEleve = async (eleve: Omit<Eleve, 'id'>): Promise<Eleve> => {
  const { nom, prenom, classe, date_naissance, status, responsable, email, telephone, adresse } = eleve;
  const [result] = await db.query(
    'INSERT INTO eleves (nom, prenom, classe, date_naissance, status, responsable, email, telephone, adresse ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nom, prenom, classe, date_naissance, status, responsable, email, telephone, adresse ]
  );
  const id = (result as any).insertId;
  return { id, ...eleve };
};

export const updateEleve = async (id: number, eleve: Omit<Eleve, 'id'>): Promise<Eleve> => {
  const { nom, prenom, classe, date_naissance, status } = eleve;
  await db.query(
    'UPDATE eleves SET nom = ?, prenom = ?, classe = ?, date_naissance = ?, status = ? WHERE id = ?',
    [nom, prenom, classe, date_naissance, status, id]
  );
  return { id, ...eleve };
};

export const deleteEleve = async (id: number): Promise<void> => {
  await db.query('DELETE FROM eleves WHERE id = ?', [id]);
};

export const filterEleves = async (filters: {
  searchTerm?: string;
  classe?: string;
  status?: string[];
}): Promise<Eleve[]> => {
  let query = 'SELECT * FROM eleves WHERE 1=1';
  const params: any[] = [];

  if (filters.searchTerm) {
    query += ' AND (nom LIKE ? OR prenom LIKE ?)';
    const search = `%${filters.searchTerm}%`;
    params.push(search, search);
  }

  if (filters.classe) {
    query += ' AND classe = ?';
    params.push(filters.classe);
  }

  if (filters.status && filters.status.length > 0) {
    query += ` AND status IN (${filters.status.map(() => '?').join(', ')})`;
    params.push(...filters.status);
  }

  const [rows] = await db.query(query, params);
  return rows as Eleve[];
};
