import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  Question,
  FindQuestionRequest,
  FindQuestionByIdRequest,
  AddQuestionRequest,
  VoteRequest,
  FakeSOSocket,
  NotificationRequest,
} from '../types';
import {
  addVoteToQuestion,
  fetchAndIncrementQuestionViewsById,
  filterQuestionsByAskedBy,
  filterQuestionsBySearch,
  getQuestionsByOrder,
  processTags,
  populateDocument,
  saveQuestion,
} from '../models/application';

const notificationController = () => {
  const router = express.Router();

  const isUserValid = (user: User): boolean =>
    user.uid !== undefined &&
    user.uid !== '' &&
    user.username !== undefined &&
    user.username !== '' &&
    user.email !== undefined &&
    user.email !== '';

  /**
   * Gets notification by user id
   *
   * @param req The NotificationRequest object containing the uid of the user.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getNotificationsByUid = async (req: NotificationRequest, res: Response): Promise<void> => {
    if (!req.body.uid) {
      res.status(400).send('Invalid request');
      return;
    }

    const { uid } = req.body;

    try {
      const notifications = await fetchNotificationsByUid(uid);

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      // Emit the updated vote counts to all connected clients
      socket.emit('voteUpdate', {
        id,
        upVotes: status.upVotes,
        downVotes: status.downVotes,
        type: 'Question',
      });
      res.json({ msg: status.msg, upVotes: status.upVotes, downVotes: status.downVotes });
    } catch (err) {
      res.status(500).send(`Error when ${type}ing: ${(err as Error).message}`);
    }
  };

  router.get('/getNotificationsByUid/:uid', getNotificationsByUid);

  return router;
};

export default notificationController;
