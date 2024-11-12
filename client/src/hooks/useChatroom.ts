import { useState, useEffect, useContext } from 'react';
import { Message } from '../types';
import UserContext from '../contexts/UserContext';
import { getMessages, sendMessageToDatabase } from '../services/chatService';

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

  // Get user from UserContext
  const context = useContext(UserContext);
  const currentUser = context?.user;

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const initialMessages = await getMessages();
        setMessages(initialMessages);
      } catch (e) {
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (!currentUser || newMessageContent.trim() === '') return;

    const newMessage: Message = {
      content: newMessageContent,
      sentBy: currentUser,
      sentDateTime: new Date(),
    };

    try {
      await sendMessageToDatabase(newMessage);
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setNewMessageContent('');
    } catch (e) {
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
  };
};

export default useChatroom;
