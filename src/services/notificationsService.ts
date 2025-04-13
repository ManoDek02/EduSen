const API_URL = 'http://localhost:3001/api/notifications';

export async function getNotifications() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function getNotificationById(id: number) {
  const res = await fetch(`${API_URL}/${id}`);
  return await res.json();
}

export async function createNotification(notification: any) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notification),
  });
  return await res.json();
}

export async function updateNotification(id: number, notification: any) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notification),
  });
  return await res.json();
}

export async function deleteNotification(id: number) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
}

export async function markAsRead(id: number) {
  const res = await fetch(`${API_URL}/${id}/read`, {
    method: 'PATCH',
  });
  return await res.json();
}

export async function markAllAsRead() {
  const res = await fetch(`${API_URL}/readAll`, {
    method: 'PATCH',
  });
  return await res.json();
}

export async function getUnreadCount() {
  const res = await fetch(`${API_URL}/unreadCount`);
  return await res.json();
}

export async function filterNotifications(criteria: any) {
  const res = await fetch(`${API_URL}/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(criteria),
  });
  return await res.json();
}
