const API_URL = 'http://localhost:3001/api/bulletins';

export async function getBulletins() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function getBulletinById(id: number) {
  const res = await fetch(`${API_URL}/${id}`);
  return await res.json();
}

export async function createBulletin(bulletin: any) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bulletin),
  });
  return await res.json();
}

export async function updateBulletin(id: number, bulletin: any) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bulletin),
  });
  return await res.json();
}

export async function deleteBulletin(id: number) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
}

export async function filterBulletins(criteria: any) {
  const res = await fetch(`${API_URL}/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(criteria),
  });
  return await res.json();
}
