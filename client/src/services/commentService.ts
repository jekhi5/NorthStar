import api from './config';
import { Comment } from '../types';

const COMMENT_API_URL = `${process.env.REACT_APP_SERVER_URL}/comment`;

/**
 * Interface extending the request body when adding a comment to a question or an answer, which contains:
 * - id - The unique identifier of the question or answer being commented on.
 * - type - The type of the comment, either 'question' or 'answer'.
 * - comment - The comment being added.
 */
interface AddCommentRequestBody {
  id?: string;
  type: 'question' | 'answer';
  comment: Comment;
}

/**
 * Adds a new comment to a specific question.
 *
 * @param id - The ID of the question to which the comment is being added.
 * @param type - The type of the comment, either 'question' or 'answer'.
 * @param comment - The comment object containing the comment details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const addComment = async (
  id: string,
  type: 'question' | 'answer',
  comment: Comment,
): Promise<Comment> => {
  const reqBody: AddCommentRequestBody = {
    id,
    type,
    comment,
  };
  const res = await api.post(`${COMMENT_API_URL}/addComment`, reqBody);
  if (res.status !== 200) {
    throw new Error('Error while creating a new comment for the question');
  }
  return res.data;
};

/**
 * Function to upvote a comment.
 *
 * @param id - The ID of the comment to upvote.
 * @param username - The username of the person upvoting the comment.
 * @throws Error if there is an issue upvoting the comment.
 */
const upvoteComment = async (id: string, uid: string) => {
  const data = { id, uid };
  const res = await api.post(`${COMMENT_API_URL}/upvoteComment`, data);
  if (res.status !== 200) {
    throw new Error('Error while upvoting the answer');
  }
  return res.data;
};

/**
 * Function to downvote a comment.
 *
 * @param qid - The ID of the comment to downvote.
 * @param username - The username of the person downvoting the comment.
 * @throws Error if there is an issue downvoting the comment.
 */
const downvoteComment = async (id: string, uid: string) => {
  const data = { id, uid };
  const res = await api.post(`${COMMENT_API_URL}/downvoteComment`, data);
  if (res.status !== 200) {
    throw new Error('Error while downvoting the answer');
  }
  return res.data;
};

export { addComment, upvoteComment, downvoteComment };
