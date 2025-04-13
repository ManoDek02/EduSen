import express from 'express';
import * as notificationsController from '../controllers/notificationsController';

const router = express.Router();

router.get('/', notificationsController.getNotifications);
router.get('/unread-count', notificationsController.getUnreadCount);
//router.get('/:id', notificationsController.getNotificationById);
router.post('/', notificationsController.createNotification);
router.put('/:id', notificationsController.updateNotification);
router.delete('/:id', notificationsController.deleteNotification);
router.patch('/:id/read', notificationsController.markAsRead);
router.patch('/mark-all-read', notificationsController.markAllAsRead);
router.post('/filter', notificationsController.filterNotifications);

export default router;
