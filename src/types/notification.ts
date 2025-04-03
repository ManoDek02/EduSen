export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  isRead: boolean;
  created_at?: string;
  updated_at?: string;
} 