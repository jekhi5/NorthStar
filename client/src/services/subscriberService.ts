import api from './config';
import { User } from '../types';

const SUBSCRIBE_API_URL = `${process.env.REACT_APP_SERVER_URL}/subscribe`;

/**
 * Interface extending the request body when toggling a subscriber to a question, which contains:
 * - id - The unique identifier of the question being commented on.
 * - user - The user being added.
 */
interface ToggleSubscriberRequestBody {
  id: string;
  type: 'question' | 'tag';
  user: User;
}

/**
 * Toggles a user as a subscriber to a specific question.
 *
 * @param id - The ID of the question to which the comment is being added.
 * @param type - The type of the post being subscribed to, either 'question' or 'tag'.
 * @param user - The user object containing the user details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const toggleSubscribe = async (id: string, type: 'question' | 'tag', user: User): Promise<User> => {
  const reqBody: ToggleSubscriberRequestBody = {
    id,
    type,
    user,
  };
  const res = await api.post(`${SUBSCRIBE_API_URL}/toggleSubscribe`, reqBody);
  if (res.status !== 200) {
    throw new Error('Error while toggling a user as a subscriber for the question');
  }
  return res.data;
};

export default toggleSubscribe;
