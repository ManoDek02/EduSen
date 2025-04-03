import pool from '@/config/database';
import { Notification } from '@/types/notification';

export const getNotifications = async (userId: number): Promise<Notification[]> => {
  const query = `
    SELECT *
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const getNotificationById = async (id: number): Promise<Notification | null> => {
  const query = 'SELECT * FROM notifications WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const createNotification = async (notification: Omit<Notification, 'id'>): Promise<Notification> => {
  const query = `
    INSERT INTO notifications (
      user_id, title, message, type, is_read
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const result = await pool.query(query, [
    notification.userId,
    notification.title,
    notification.message,
    notification.type,
    notification.isRead
  ]);
  return result.rows[0];
};

export const updateNotification = async (id: number, notification: Partial<Notification>): Promise<Notification> => {
  const query = `
    UPDATE notifications
    SET title = COALESCE($1, title),
        message = COALESCE($2, message),
        type = COALESCE($3, type),
        is_read = COALESCE($4, is_read)
    WHERE id = $5
    RETURNING *
  `;
  const result = await pool.query(query, [
    notification.title,
    notification.message,
    notification.type,
    notification.isRead,
    id
  ]);
  return result.rows[0];
};

export const deleteNotification = async (id: number): Promise<void> => {
  const query = 'DELETE FROM notifications WHERE id = $1';
  await pool.query(query, [id]);
};

export const markAsRead = async (id: number): Promise<void> => {
  const query = 'UPDATE notifications SET is_read = true WHERE id = $1';
  await pool.query(query, [id]);
};

export const markAllAsRead = async (userId: number): Promise<void> => {
  const query = 'UPDATE notifications SET is_read = true WHERE user_id = $1';
  await pool.query(query, [userId]);
};

export const getUnreadCount = async (userId: number): Promise<number> => {
  const query = 'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false';
  const result = await pool.query(query, [userId]);
  return parseInt(result.rows[0].count);
};

export const filterNotifications = async (filters: {
  userId: number;
  type?: string[];
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
}): Promise<Notification[]> => {
  let query = `
    SELECT *
    FROM notifications
    WHERE user_id = $1
  `;
  const params: any[] = [filters.userId];
  let paramIndex = 2;

  if (filters.type && filters.type.length > 0) {
    query += ` AND type = ANY($${paramIndex})`;
    params.push(filters.type);
    paramIndex++;
  }

  if (filters.isRead !== undefined) {
    query += ` AND is_read = $${paramIndex}`;
    params.push(filters.isRead);
    paramIndex++;
  }

  if (filters.startDate) {
    query += ` AND created_at >= $${paramIndex}`;
    params.push(filters.startDate);
    paramIndex++;
  }

  if (filters.endDate) {
    query += ` AND created_at <= $${paramIndex}`;
    params.push(filters.endDate);
    paramIndex++;
  }

  query += ' ORDER BY created_at DESC';

  const result = await pool.query(query, params);
  return result.rows;
}; 