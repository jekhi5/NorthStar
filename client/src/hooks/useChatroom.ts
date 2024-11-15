import { useState, useEffect } from 'react';
import { Message } from '../types';
import { getMessages, sendMessageToDatabase } from '../services/chatService';
import useUserContext from './useUserContext';

/*
 * Constant that determines how many of the most recent messages will display.
 * Change this value to change how many messages show.
 */
const MESSAGE_LIMIT: number = 20;

/**
 * Custom hook for managing chatroom state and logic.
 *
 * @returns messages - Array of chat messages.
 * @returns newMessageContent - Current content of the input message.
 * @returns setNewMessageContent - Function to update the input message content.
 * @returns sendMessage - Function to send a new message.
 * @returns loading - Boolean indicating if messages are loading.
 * @returns error - Error message if message fetching or sending fails.
 */
const useChatroom = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user
  const { user, socket } = useUserContext();
  const currentUser = user;

  // Using two useEffects to separate logic
  // This one handles initial data retrieval
  useEffect(() => {
    /**
     * Fetches messages when the component mounts.
     */
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // Set message limit in param
        const initialMessages = await getMessages(MESSAGE_LIMIT);
        setMessages(initialMessages);
      } catch (err) {
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (socket) {
      /**
       * Function to handle new messages.
       *
       * @param message - The new message object.
       */
      const handleNewMessage = (message: Message) => {
        setMessages(prevMessages => [message, ...prevMessages]);
      };
      socket.on('newMessage', handleNewMessage);
      // Clean up listener when the component unmounts
      return () => {
        socket.off('newMessage', handleNewMessage);
      };
    }

    // Return an empty cleanup function if socket is not available
    return () => {};
  }, [socket]);

  /**
   * Function to handle sending messages.
   */
  const sendMessage = async () => {
    if (!currentUser || newMessageContent.trim() === '') return;

    const newMessage: Message = {
      content: newMessageContent,
      sentBy: currentUser,
      sentDateTime: new Date(),
    };

    try {
      await sendMessageToDatabase(newMessage);
      setNewMessageContent('');
    } catch (err) {
      setError('Failed to send message');
    }
  };

  return {
    messages,
    newMessageContent,
    setNewMessageContent,
    sendMessage,
    loading,
    error,
    currentUser,
  };
};

export default useChatroom;
