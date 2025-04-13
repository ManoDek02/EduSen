import { Eleve } from '@/types/eleve';

const API_BASE = 'http://localhost:8080/api/eleves';

export const getEleves = async (): Promise<Eleve[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Erreur lors du chargement des élèves");
  return res.json();
};

export const addEleve = async (eleve: Omit<Eleve, 'id'>): Promise<Eleve> => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eleve)
  });
  if (!res.ok) throw new Error("Erreur lors de l'ajout de l'élève");
  return res.json();
};

export const updateEleve = async (id: number, eleve: Omit<Eleve, 'id'>): Promise<Eleve> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eleve)
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour de l'élève");
  return res.json();
};

export const deleteEleve = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression de l'élève");
};

export const filterEleves = async (filters: {
  searchTerm?: string;
  classe?: string;
  status?: string[];
}): Promise<Eleve[]> => {
  const res = await fetch(`${API_BASE}/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters)
  });
  if (!res.ok) throw new Error("Erreur lors du filtrage des élèves");
  return res.json();
};
