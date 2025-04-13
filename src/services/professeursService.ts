const API_URL = 'http://localhost:3001/api/professeurs';

export async function getProfesseurs() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function getProfesseurById(id: number) {
  const res = await fetch(`${API_URL}/${id}`);
  return await res.json();
}

export async function createProfesseur(professeur: any) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(professeur),
  });
  return await res.json();
}

export async function updateProfesseur(id: number, professeur: any) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(professeur),
  });
  return await res.json();
}

export async function deleteProfesseur(id: number) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
}

export async function filterProfesseurs(criteria: any) {
  const res = await fetch(`${API_URL}/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(criteria),
  });
  return await res.json();
}
