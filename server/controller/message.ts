import express, { Response, Request } from 'express';
import { getMessages, saveMessage, updateMessage, deleteMessage } from '../models/application';
import { FakeSOSocket, Message } from '../types';

const messageController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Validates if the provided message contains the required fields.
   *
   * @param message The message object to validate.
   *
   * @returns `true` if the message is valid, otherwise `false`.
   */
  function isMessageValid(message: Message): boolean {
    return !!message.content && !!message.sentBy && !!message.sentDateTime;
  }

  /**
   * Retrieves all messages in the chatroom.
   *
   * @param req The request object.
   * @param res The response object.
   *
   * @returns A Promise that resolves to void.
   */
  const getAllMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const messages = await getMessages();
      if ('error' in messages) {
        throw new Error(messages.error);
      }
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: `Failed to load messages: ${(error as Error).message}` });
    }
  };

  /**
   * Adds a new message to the chatroom and emits it to connected clients.
   *
   * @param req The request object containing the message data.
   * @param res The response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addMessage = async (req: Request, res: Response): Promise<void> => {
    const messageData: Message = req.body;

    if (!isMessageValid(messageData)) {
      res.status(400).send('Invalid message');
      return;
    }

    try {
      const newMessage = await saveMessage(messageData);
      if ('error' in newMessage) {
        throw new Error(newMessage.error);
      }
      socket.emit('newMessage', newMessage);
      res.json(newMessage);
    } catch (error) {
      res.status(500).json({ error: `Failed to send message: ${(error as Error).message}` });
    }
  };

  /**
   * Updates a message by ID and emits the updated message to connected clients.
   *
   * @param req The request object containing the updated message data.
   * @param res The response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const updateMessageById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const updatedMessage = await updateMessage(id, updatedData);
      if ('error' in updatedMessage) {
        throw new Error(updatedMessage.error);
      }
      socket.emit('messageUpdate', updatedMessage);
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ error: `Failed to update message: ${(error as Error).message}` });
    }
  };

  /**
   * Deletes a message by ID and notifies connected clients.
   *
   * @param req The request object containing the message ID.
   * @param res The response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const deleteMessageById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const deletionResult = await deleteMessage(id);
      if ('error' in deletionResult) {
        throw new Error(deletionResult.error);
      }
      socket.emit('messageDelete', id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: `Failed to delete message: ${(error as Error).message}` });
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.get('/getMessages', getAllMessages);
  router.post('/sendMessage', addMessage);
  router.put('/updateMessage/:id', updateMessageById);
  router.delete('/deleteMessage/:id', deleteMessageById);

  return router;
};

export default messageController;
