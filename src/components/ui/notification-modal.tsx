import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Notification } from '@/services/notificationService';

interface NotificationModalProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  isOpen,
  onClose,
}) => {
  if (!notification) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{notification.title}</span>
            <Badge 
              variant={
                notification.type === 'success' ? 'default' :
                notification.type === 'warning' ? 'secondary' : 'outline'
              }
            >
              {notification.type === 'success' ? 'Succès' :
               notification.type === 'warning' ? 'Attention' : 'Information'}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-4">
            {format(new Date(notification.date), 'PPp', { locale: fr })}
          </p>
          <p className="text-gray-700 whitespace-pre-wrap">{notification.message}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 