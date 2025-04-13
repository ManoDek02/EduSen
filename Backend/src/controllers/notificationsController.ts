import { Request, Response } from 'express';
import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';

export const getNotifications = async (req: Request, res: Response) => {
  const { userId } = req.query;
  const [rows] = await pool.query(
    `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  res.json(rows);
};

export const getNotificationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const [rows] = await pool.query('SELECT * FROM notifications WHERE id = ?', [id]) as [any[], any];
  if (!rows[0]) return res.status(404).send('Notification non trouvée');
  res.json(rows[0]);
};

export const createNotification = async (req: Request, res: Response) => {
  const { userId, title, message, type, isRead } = req.body;
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO notifications (user_id, title, message, type, is_read)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, title, message, type, isRead]
  );
  
  const [newNotification] = await pool.query('SELECT * FROM notifications WHERE id = ?', [result.insertId]) as [any[], any];
  res.status(201).json(newNotification[0]);
};

export const updateNotification = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, message, type, isRead } = req.body;
  await pool.query(
    `UPDATE notifications SET
     title = COALESCE(?, title),
     message = COALESCE(?, message),
     type = COALESCE(?, type),
     is_read = COALESCE(?, is_read)
     WHERE id = ?`,
    [title, message, type, isRead, id]
  );
 
  const [updated] = await pool.query('SELECT * FROM notifications WHERE id = ?', [id]) as [any[], any];
  
  res.json(updated[0]);
};

export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM notifications WHERE id = ?', [id]);
  res.sendStatus(204);
};

export const markAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('UPDATE notifications SET is_read = true WHERE id = ?', [id]);
  res.sendStatus(200);
};

export const markAllAsRead = async (req: Request, res: Response) => {
  const { userId } = req.query;
  await pool.query('UPDATE notifications SET is_read = true WHERE user_id = ?', [userId]);
  res.sendStatus(200);
};

export const getUnreadCount = async (req: Request, res: Response) => {
  const { userId } = req.query;
  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = false', [userId]) as [any[],any];
  res.json(rows[0]);
};

export const filterNotifications = async (req: Request, res: Response) => {
  const { userId, type, isRead, startDate, endDate } = req.body;
  const params: any[] = [userId];
  let query = `SELECT * FROM notifications WHERE user_id = ?`;

  if (type && type.length > 0) {
    query += ` AND type IN (${type.map(() => '?').join(',')})`;
    params.push(...type);
  }

  if (isRead !== undefined) {
    query += ` AND is_read = ?`;
    params.push(isRead);
  }

  if (startDate) {
    query += ` AND created_at >= ?`;
    params.push(startDate);
  }

  if (endDate) {
    query += ` AND created_at <= ?`;
    params.push(endDate);
  }

  query += ' ORDER BY created_at DESC';

  const [rows] = await pool.query(query, params);
  res.json(rows);
};
