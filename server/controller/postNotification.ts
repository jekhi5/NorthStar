import express, { Response } from 'express';
import { FakeSOSocket, PostNotificationRequest } from '../types';
import { updateNotificationReadStatus } from '../models/application';

const notificationController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Handles marking a notification as read by the user.
   *
   * @param req The PostNotificationRequest object containing the PostNotification ID and the uid of the user.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const markPostNotificationAsRead = async (
    req: PostNotificationRequest,
    res: Response,
  ): Promise<void> => {
    if (!req.body.uid || !req.body.postNotificationId) {
      res.status(400).send('Invalid request');
      return;
    }

    const { postNotificationId, uid } = req.body;

    try {
      const updatedUser = await updateNotificationReadStatus(uid, postNotificationId);

      if ('error' in updatedUser) {
        throw new Error(updatedUser.error);
      }
      socket.emit('postNotificationUpdate', { type: 'markRead' });
      res.sendStatus(200);
    } catch (error) {
      res
        .status(500)
        .json({ error: `Failed to mark notification as read: ${(error as Error).message}` });
    }
  };

  router.put('/markAsRead', markPostNotificationAsRead);

  return router;
};
export default notificationController;
