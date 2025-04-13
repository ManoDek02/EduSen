// frontend/src/services/coursService.ts
const BASE_URL = 'http://localhost:8080/api/cours';

export const fetchCours = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const fetchCoursById = async (id: number) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
};

export const createCours = async (cours: { nom: string; enseignant: string }) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cours),
  });
  return res.json();
};

export const updateCours = async (id: number, cours: { nom: string; enseignant: string }) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cours),
  });
  return res.json();
};

export const deleteCours = async (id: number) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
