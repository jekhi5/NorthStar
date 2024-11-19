import { Question } from '../types';
import api from './config';

const QUESTION_API_URL = `${process.env.REACT_APP_SERVER_URL}/question`;

/**
 * Function to get questions by filter.
 *
 * @param order - The order in which to fetch questions. Default is 'newest'.
 * @param search - The search term to filter questions. Default is an empty string.
 * @throws Error if there is an issue fetching or filtering questions.
 */
const getQuestionsByFilter = async (
  order: string = 'newest',
  search: string = '',
  askedBy: string = '',
): Promise<Question[]> => {
  let res;
  if (askedBy === '') {
    res = await api.get(`${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`);
  } else {
    res = await api.get(
      `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}&askedBy=${askedBy}`,
    );
  }
  if (res.status !== 200) {
    throw new Error('Error when fetching or filtering questions');
  }
  return res.data;
};

/**
 * Function to get a question by its ID.
 *
 * @param qid - The ID of the question to retrieve.
 * @param uid - The uid of the user requesting the question.
 * @throws Error if there is an issue fetching the question by ID.
 */
const getQuestionById = async (qid: string, uid: string): Promise<Question> => {
  const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}?uid=${uid}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching question by id');
  }
  return res.data;
};

/**
 * Retrieves questions from the database if they were posted by the user with the provided id.
 *
 * @param userId - The id of the question poster's user.
 * @throws Error if there is an issue fetching the question by user id.
 */
const getQuestionsByAskedByUserId = async (userId: string): Promise<Question[]> => {
  const res = await api.get(`${QUESTION_API_URL}/getQuestionsByAskedByUserId/?userId=${userId}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching questions by uid');
  }
  return res.data;
};

/**
 * Retrieves questions from the database if they were answered by the user with the provided id.
 *
 * @param userId - The id of the answer poster user.
 * @throws Error if there is an issue fetching the question by user id.
 */
const getQuestionsByAnsweredByUserId = async (userId: string): Promise<Question[]> => {
  const res = await api.get(`${QUESTION_API_URL}/getQuestionsByAnsweredByUserId/?userId=${userId}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching questions by answer user id');
  }
  return res.data;
};

/**
 * Function to add a new question.
 *
 * @param q - The question object to add.
 * @throws Error if there is an issue creating the new question.
 */
const addQuestion = async (q: Question): Promise<Question> => {
  const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);

  if (res.status !== 200) {
    throw new Error('Error while creating a new question');
  }

  return res.data;
};

/**
 * Function to upvote a question.
 *
 * @param qid - The ID of the question to upvote.
 * @param uid - The uid of the person upvoting the question.
 * @throws Error if there is an issue upvoting the question.
 */
const upvoteQuestion = async (qid: string, uid: string) => {
  // The field `qid` in the data object was changed to `id` when voting was expanded beyond just questions
  const data = { id: qid, uid };
  const res = await api.post(`${QUESTION_API_URL}/upvoteQuestion`, data);
  if (res.status !== 200) {
    throw new Error('Error while upvoting the question');
  }
  return res.data;
};

/**
 * Function to downvote a question.
 *
 * @param qid - The ID of the question to downvote.
 * @param uid - The uid of the person downvoting the question.
 * @throws Error if there is an issue downvoting the question.
 */
const downvoteQuestion = async (qid: string, uid: string) => {
  // The field `qid` in the data object was changed to `id` when voting was expanded beyond just questions
  const data = { id: qid, uid };
  const res = await api.post(`${QUESTION_API_URL}/downvoteQuestion`, data);
  if (res.status !== 200) {
    throw new Error('Error while downvoting the question');
  }
  return res.data;
};

export {
  getQuestionsByFilter,
  getQuestionById,
  getQuestionsByAskedByUserId,
  getQuestionsByAnsweredByUserId,
  addQuestion,
  upvoteQuestion,
  downvoteQuestion,
};
