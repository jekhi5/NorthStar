import { Answer } from '../types';
import api from './config';

const ANSWER_API_URL = `${process.env.REACT_APP_SERVER_URL}/answer`;

/**
 * Adds a new answer to a specific question.
 *
 * @param qid - The ID of the question to which the answer is being added.
 * @param ans - The answer object containing the answer details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const addAnswer = async (qid: string, ans: Answer): Promise<Answer> => {
  const data = { qid, ans ***REMOVED***

  const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new answer');
  }
  return res.data;
***REMOVED***

/**
 * Function to upvote an answer.
 *
 * @param id - The ID of the answer to upvote.
 * @param username - The username of the person upvoting the answer.
 * @throws Error if there is an issue upvoting the answer.
 */
const upvoteAnswer = async (id: string, username: string) => {
  const data = { id, username ***REMOVED***
  const res = await api.post(`${ANSWER_API_URL}/upvoteAnswer`, data);
  if (res.status !== 200) {
    throw new Error('Error while upvoting the answer');
  }
  return res.data;
***REMOVED***

/**
 * Function to downvote an answer.
 *
 * @param qid - The ID of the answer to downvote.
 * @param username - The username of the person downvoting the answer.
 * @throws Error if there is an issue downvoting the answer.
 */
const downvoteAnswer = async (id: string, username: string) => {
  const data = { id, username ***REMOVED***
  const res = await api.post(`${ANSWER_API_URL}/downvoteAnswer`, data);
  if (res.status !== 200) {
    throw new Error('Error while downvoting the answer');
  }
  return res.data;
***REMOVED***

export { addAnswer, upvoteAnswer, downvoteAnswer ***REMOVED***
