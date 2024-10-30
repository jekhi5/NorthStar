import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import { Comment, AddCommentRequest, FakeSOSocket, VoteRequest } from '../types';
import { addComment, addVoteToComment, populateDocument, saveComment } from '../models/application';

const commentController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided answer request contains the required fields.
   *
   * @param req The request object containing the answer data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddCommentRequest): boolean =>
    !!req.body.id &&
    !!req.body.type &&
    (req.body.type === 'question' || req.body.type === 'answer') &&
    !!req.body.comment &&
    req.body.comment.text !== undefined &&
    req.body.comment.commentBy !== undefined &&
    req.body.comment.commentDateTime !== undefined;

  /**
   * Validates the comment object to ensure it is not empty.
   *
   * @param comment The comment to validate.
   *
   * @returns `true` if the coment is valid, otherwise `false`.
   */
  const isCommentValid = (comment: Comment): boolean =>
    comment.text !== undefined &&
    comment.text !== '' &&
    comment.commentBy !== undefined &&
    comment.commentBy !== '' &&
    comment.commentDateTime !== undefined &&
    comment.commentDateTime !== null;

  /**
   * Handles adding a new comment to the specified question or answer. The comment is first validated and then saved.
   * If the comment is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The AddCommentRequest object containing the comment data.
   * @param res The HTTP response object used to send back the result of the operation.
   * @param type The type of the comment, either 'question' or 'answer'.
   *
   * @returns A Promise that resolves to void.
   */
  const addCommentRoute = async (req: AddCommentRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const id = req.body.id as string;

    if (!ObjectId.isValid(id)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    const { comment, type } = req.body;

    if (!isCommentValid(comment)) {
      res.status(400).send('Invalid comment body');
      return;
    }

    try {
      const comFromDb = await saveComment(comment);

      if ('error' in comFromDb) {
        throw new Error(comFromDb.error);
      }

      const status = await addComment(id, type, comFromDb);

      if (status && 'error' in status) {
        throw new Error(status.error);
      }

      // Populates the fields of the question or answer that this comment
      // was added to, and emits the updated object
      const populatedDoc = await populateDocument(id, type);

      if (populatedDoc && 'error' in populatedDoc) {
        throw new Error(populatedDoc.error);
      }

      socket.emit('commentUpdate', {
        result: populatedDoc,
        type,
      });
      res.json(comFromDb);
    } catch (err: unknown) {
      res.status(500).send(`Error when adding comment: ${(err as Error).message}`);
    }
  ***REMOVED***

  /**
   * Helper function to handle upvoting or downvoting a comment.
   *
   * @param req The VoteRequest object containing the comment ID and the username.
   * @param res The HTTP response object used to send back the result of the operation.
   * @param type The type of vote to perform (upvote or downvote).
   *
   * @returns A Promise that resolves to void.
   */
  const voteComment = async (
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
        status = await addVoteToComment(new ObjectId(id), username, type);
      } else {
        status = await addVoteToComment(new ObjectId(id), username, type);
      }

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      // Emit the updated vote counts to all connected clients
      socket.emit('voteUpdate', {
        id,
        upVotes: status.upVotes,
        downVotes: status.downVotes,
      });
      res.json({ msg: status.msg, upVotes: status.upVotes, downVotes: status.downVotes });
    } catch (err) {
      res.status(500).send(`Error when ${type}ing: ${(err as Error).message}`);
    }
  ***REMOVED***

  /**
   * Handles upvoting a comment. The request must contain the comment ID and the username.
   * If the request is invalid or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The VoteRequest object containing the comment ID and the username.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const upvoteComment = async (req: VoteRequest, res: Response): Promise<void> => {
    voteComment(req, res, 'upvote');
  ***REMOVED***

  /**
   * Handles downvoting a comment. The request must contain the comment ID and the username.
   * If the request is invalid or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The VoteRequest object containing the comment ID and the username.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const downvoteComment = async (req: VoteRequest, res: Response): Promise<void> => {
    voteComment(req, res, 'downvote');
  ***REMOVED***

  router.post('/addComment', addCommentRoute);
  router.post('/upvoteComment', upvoteComment);
  router.post('/downvoteComment', downvoteComment);

  return router;
***REMOVED***

export default commentController;
