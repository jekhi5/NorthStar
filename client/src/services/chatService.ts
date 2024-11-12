// services/chatService.ts
import { Message } from '../types';
import api from './config';

const CHAT_API_URL = `${process.env.REACT_APP_SERVER_URL}/chat`;

/**
 * Fetches all messages for the chatroom.
 *
 * @returns Promise<Message[]> - Array of message objects.
 * @throws Error if there is an issue fetching messages.
 */
const getMessages = async (): Promise<Message[]> => {
  const res = await api.get(`${CHAT_API_URL}/getMessages`);
  if (res.status !== 200) {
    throw new Error('Error while fetching messages');
  }
  return res.data;
};

/**
 * Sends a new message to the chatroom.
 *
 * @param message - The message object to be sent.
 * @returns Promise<Message> - The created message object.
 * @throws Error if there is an issue sending the message.
 */
const sendMessageToDatabase = async (message: Message): Promise<Message> => {
  const res = await api.post(`${CHAT_API_URL}/sendMessage`, message);
  if (res.status !== 200) {
    throw new Error('Error while sending message');
  }
  return res.data;
};

/**
 * Deletes a message from the chatroom.
 *
 * @param messageId - The ID of the message to delete.
 * @returns Promise<void>
 * @throws Error if there is an issue deleting the message.
 */
const deleteMessage = async (messageId: string): Promise<void> => {
  const res = await api.delete(`${CHAT_API_URL}/deleteMessage/${messageId}`);
  if (res.status !== 200) {
    throw new Error('Error while deleting message');
  }
};

export { getMessages, sendMessageToDatabase, deleteMessage };
