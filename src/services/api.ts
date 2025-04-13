import { Note } from '@/types/note';

const API_BASE_URL = 'http://localhost:8080/api'; // ⚠️ adapte le port si besoin

export const apiGet = async <T>(url: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`);

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.statusText}`);
  }

  return response.json();
};


export const fetchGrades = async (): Promise<Note[]> => {
    const res = await fetch('/api/notes');
    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des notes');
    }
    const data = await res.json();
    return data; // ✅ ici tu retournes bien un tableau de notes
  };
  