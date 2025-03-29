import axios from 'axios';
import { API_URL } from '@/config';

// Données temporaires pour le développement
const mockNotifications = [
  {
    id: 1,
    title: "Nouvelle note disponible",
    message: "Votre professeur a ajouté une nouvelle note pour le cours de Mathématiques",
    date: new Date(),
    isRead: false,
    type: 'info' as const
  },
  {
    id: 2,
    title: "Modification d'emploi du temps",
    message: "L'emploi du temps a été mis à jour pour la semaine prochaine",
    date: new Date(Date.now() - 86400000), // 1 jour avant
    isRead: true,
    type: 'warning' as const
  },
  {
    id: 3,
    title: "Bulletin disponible",
    message: "Votre bulletin du premier trimestre est maintenant disponible",
    date: new Date(Date.now() - 172800000), // 2 jours avant
    isRead: false,
    type: 'success' as const
  }
];

let notifications = [...mockNotifications];

export interface Notification {
  id: number;
  title: string;
  message: string;
  date: Date;
  isRead: boolean;
  type: 'info' | 'warning' | 'success';
}

export const notificationService = {
  // Récupérer toutes les notifications d'un élève
  getNotifications: async (): Promise<Notification[]> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    return notifications;
  },

  // Marquer une notification comme lue
  markAsRead: async (id: number): Promise<void> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    notifications = notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    );
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async (): Promise<void> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    notifications = notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
  },

  // Récupérer le nombre de notifications non lues
  getUnreadCount: async (): Promise<number> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    return notifications.filter(n => !n.isRead).length;
  }
}; 