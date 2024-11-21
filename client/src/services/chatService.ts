import { Message } from '../types';
import api from './config';

const CHAT_API_URL = `${process.env.REACT_APP_SERVER_URL}/chat`;

/**
 * Fetches messages for the chatroom.
 *
 * @param limit - The number of messages to display, if provided.
 *
 * @returns Promise<Message[]> - Array of message objects.
 * @throws Error if there is an issue fetching messages.
 */
const getMessages = async (limit?: number): Promise<Message[]> => {
  const url = limit ? `${CHAT_API_URL}/getMessages?limit=${limit}` : `${CHAT_API_URL}/getMessages`;
  const res = await api.get(url);
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
    // might need to change this to 201?
    throw new Error('Error while sending message');
  }
  return res.data;
};

// TODO might delete this - don't think we actually want people to be able to delete messages
// There's also no current button/way for users to delete,
// just added this and update for potential convenience
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
