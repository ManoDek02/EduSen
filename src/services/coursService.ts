// frontend/src/services/coursService.ts
const BASE_URL = 'http://localhost:8080/api/cours';

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Une erreur est survenue');
  }
  return res.json();
};

// Fonction pour récupérer tous les cours
export const fetchCours = async () => {
  try {
    const res = await fetch(BASE_URL);
    return await handleResponse(res);
  } catch (error) {
    console.error('Erreur de récupération des cours:', error);
    throw error;  // Laisse l'appelant gérer l'erreur
  }
};

// Fonction pour récupérer un cours par son ID
export const fetchCoursById = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    return await handleResponse(res);
  } catch (error) {
    console.error('Erreur de récupération du cours:', error);
    throw error;
  }
};

// Fonction pour créer un nouveau cours
export const createCours = async (cours: { nom: string; enseignant: string }) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cours),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Erreur de création du cours:', error);
    throw error;
  }
};

// Fonction pour mettre à jour un cours
export const updateCours = async (id: number, cours: { nom: string; enseignant: string }) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cours),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Erreur de mise à jour du cours:', error);
    throw error;
  }
};

// Fonction pour supprimer un cours
export const deleteCours = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Erreur de suppression du cours:', error);
    throw error;
  }
};
