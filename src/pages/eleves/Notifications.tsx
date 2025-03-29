import React, { useState } from 'react';
import { Bell, Circle, RefreshCw, Eye } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, Notification } from '@/services/notificationService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { NotificationModal } from '@/components/ui/notification-modal';
import MainLayout from '@/components/layout/MainLayout';

const Notifications = () => {
  const queryClient = useQueryClient();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Récupérer les notifications avec rafraîchissement automatique
  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    staleTime: 10000, // Considérer les données comme périmées après 10 secondes
  });

  // Mutation pour marquer une notification comme lue
  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification marquée comme lue');
    },
    onError: (error) => {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour de la notification');
    },
  });

  // Mutation pour marquer toutes les notifications comme lues
  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Toutes les notifications ont été marquées comme lues');
    },
    onError: (error) => {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour des notifications');
    },
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const handleViewNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
  };

  if (error) {
    return (
      <MainLayout title="NOTIFICATIONS">
        <div className="flex flex-col items-center justify-center h-[600px] gap-4">
          <p className="text-red-500">Une erreur est survenue lors du chargement des notifications</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout title="NOTIFICATIONS">
        <div className="flex items-center justify-center h-[600px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="NOTIFICATIONS">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-[#0046AD]" />
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="bg-[#0046AD] hover:bg-[#003c91] text-white"
              >
                Tout marquer comme lu
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="bg-[#0046AD] hover:bg-[#003c91] text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        <Card className="border-t-4 border-t-[#0046AD]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#0046AD]">Liste des notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Aucune notification
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        notification.isRead ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {!notification.isRead && (
                          <Circle className="h-2 w-2 text-blue-500 mt-2" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <span className="text-sm text-gray-500">
                              {format(new Date(notification.date), 'PPp', { locale: fr })}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant={
                                notification.type === 'success' ? 'default' :
                                notification.type === 'warning' ? 'secondary' : 'outline'
                              }
                            >
                              {notification.type === 'success' ? 'Succès' :
                               notification.type === 'warning' ? 'Attention' : 'Information'}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-auto bg-[#0046AD] hover:bg-[#003c91] text-white"
                              onClick={() => handleViewNotification(notification)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <NotificationModal
          notification={selectedNotification}
          isOpen={!!selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      </div>
    </MainLayout>
  );
};

export default Notifications;
