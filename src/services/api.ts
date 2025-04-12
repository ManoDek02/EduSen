const API_BASE_URL = 'http://localhost:5000/api'; // ⚠️ adapte le port si besoin

export const apiGet = async <T>(url: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`);

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.statusText}`);
  }

  return response.json();
};