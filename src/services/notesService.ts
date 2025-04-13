const API_URL = 'http://localhost:3001/api/notes';

export async function fetchGrades() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function getNoteById(id: number) {
  const res = await fetch(`${API_URL}/${id}`);
  return await res.json();
}

export async function createNote(note: any) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  return await res.json();
}

export async function updateNote(id: number, note: any) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  return await res.json();
}

export async function deleteNote(id: number) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
}

export async function filterNotes(criteria: any) {
  const res = await fetch(`${API_URL}/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(criteria),
  });
  return await res.json();
}
