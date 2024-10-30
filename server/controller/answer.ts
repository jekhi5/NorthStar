import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import { Answer, AnswerRequest, AnswerResponse, FakeSOSocket, VoteRequest } from '../types';
import {
  addAnswerToQuestion,
  addVoteToAnswer,
  populateDocument,
  saveAnswer,
} from '../models/application';

const answerController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided answer request contains the required fields.
   *
   * @param req The request object containing the answer data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isRequestValid(req: AnswerRequest): boolean {
    return !!req.body.qid && !!req.body.ans;
  }

  /**
   * Checks if the provided answer contains the required fields.
   *
   * @param ans The answer object to validate.
   *
   * @returns `true` if the answer is valid, otherwise `false`.
   */
  function isAnswerValid(ans: Answer): boolean {
    return !!ans.text && !!ans.ansBy && !!ans.ansDateTime;
  }

  /**
   * Adds a new answer to a question in the database. The answer request and answer are
   * validated and then saved. If successful, the answer is associated with the corresponding
   * question. If there is an error, the HTTP response's status is updated.
   *
   * @param req The AnswerRequest object containing the question ID and answer data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addAnswer = async (req: AnswerRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }
    if (!isAnswerValid(req.body.ans)) {
      res.status(400).send('Invalid answer');
      return;
    }

    const { qid } = req.body;
    const ansInfo: Answer = req.body.ans;

    try {
      const ansFromDb = await saveAnswer(ansInfo);

      if ('error' in ansFromDb) {
        throw new Error(ansFromDb.error as string);
      }

      const status = await addAnswerToQuestion(qid, ansFromDb);

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      const populatedAns = await populateDocument(ansFromDb._id?.toString(), 'answer');

      if (populatedAns && 'error' in populatedAns) {
        throw new Error(populatedAns.error as string);
      }

      // Populates the fields of the answer that was added and emits the new object
      socket.emit('answerUpdate', {
        qid,
        answer: populatedAns as AnswerResponse,
      });
      res.json(ansFromDb);
    } catch (err) {
      res.status(500).send(`Error when adding answer: ${(err as Error).message}`);
    }
  };

  /**
   * Helper function to handle upvoting or downvoting an answer.
   *
   * @param req The VoteRequest object containing the answer ID and the username.
   * @param res The HTTP response object used to send back the result of the operation.
   * @param type The type of vote to perform (upvote or downvote).
   *
   * @returns A Promise that resolves to void.
   */
  const voteAnswer = async (
    req: VoteRequest,
    res: Response,
    type: 'upvote' | 'downvote',
  ): Promise<void> => {
    if (!req.body.id || !req.body.username) {
      res.status(400).send('Invalid request');
      return;
    }

    const { id, username } = req.body;

    try {
      let status;
      if (type === 'upvote') {
        status = await addVoteToAnswer(new ObjectId(id), username, type);
      } else {
        status = await addVoteToAnswer(new ObjectId(id), username, type);
      }

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      // Emit the updated vote counts to all connected clients
      socket.emit('voteUpdate', {
        id,
        upVotes: status.upVotes,
        downVotes: status.downVotes,
        type: 'Answer',
      });
      res.json({ msg: status.msg, upVotes: status.upVotes, downVotes: status.downVotes });
    } catch (err) {
      res.status(500).send(`Error when ${type}ing: ${(err as Error).message}`);
    }
  };

  /**
   * Handles upvoting an answer. The request must contain the answer ID and the username.
   * If the request is invalid or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The VoteRequest object containing the answer ID and the username.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const upvoteAnswer = async (req: VoteRequest, res: Response): Promise<void> => {
    voteAnswer(req, res, 'upvote');
  };

  /**
   * Handles downvoting an answer. The request must contain the answer ID and the username.
   * If the request is invalid or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The VoteRequest object containing the answer ID and the username.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const downvoteAnswer = async (req: VoteRequest, res: Response): Promise<void> => {
    voteAnswer(req, res, 'downvote');
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/addAnswer', addAnswer);
  router.post('/upvoteAnswer', upvoteAnswer);
  router.post('/downvoteAnswer', downvoteAnswer);

  return router;
};

export default answerController;
