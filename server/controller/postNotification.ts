import express, { Response } from 'express';
import { NotificationRequest } from '../types';
import { fetchNotificationsByUid } from '../models/application';

const notificationController = () => {
  const router = express.Router();

  /**
   * Gets notification by user id
   *
   * @param req The NotificationRequest object containing the uid of the user.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getNotificationsByUid = async (req: NotificationRequest, res: Response): Promise<void> => {
    const { uid } = req.params;
    try {
      const notifications = await fetchNotificationsByUid(uid);

      if (notifications && 'error' in notifications) {
        throw new Error('Error while fetching notifications');
      }

      res.json(notifications);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching post notifications: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching post notifications`);
      }
    }
  };

  router.get('/getNotificationsByUid/:uid', getNotificationsByUid);

  return router;
};

export default notificationController;
