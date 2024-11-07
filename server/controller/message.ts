import express from 'express';
import { Message, FakeSOSocket } from '../types';

const messageController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Validates the message object to ensure it is not empty.
   *
   *
   * @param message The message to validate.
   *
   * @returns `true` if the message is valid, otherwise `false`.
   *
   */
  const isMessageValid = (message: Message): boolean =>
    message.content !== undefined &&
    message.content !== '' &&
    message.sentBy !== undefined &&
    message.sentBy.uid !== '' &&
    message.sentDateTime !== undefined &&
    message.sentDateTime !== null;

  return router;
};

export default messageController;
