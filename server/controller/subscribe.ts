import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  FakeSOSocket,
  ToggleSubscriberRequest,
  User,
  QuestionResponse,
  AnswerResponse,
  TagResponse,
} from '../types';
import { populateDocument, toggleSubscribe } from '../models/application';

const subscribeController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided user request contains the required fields.
   *
   * @param req The request object containing the user data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: ToggleSubscriberRequest): boolean =>
    !!req.body.id &&
    !!req.body.user &&
    req.body.user.username !== undefined &&
    req.body.user.email !== undefined;

  /**
   * Validates the user object to ensure it is not empty.
   *
   * @param comment The comment to validate.
   *
   * @returns `true` if the comment is valid, otherwise `false`.
   */
  const isUserValid = (user: User): boolean =>
    user.username !== undefined &&
    user.username !== '' &&
    user.email !== undefined &&
    user.email !== '';

  /**
   * Type guard to check if a document is a valid QuestionResponse.
   *
   * @param doc The document to check.
   *
   * @returns `true` if the document is a valid QuestionResponse, otherwise `false`.
   */
  function isQuestionResponse(
    doc: QuestionResponse | AnswerResponse | TagResponse | null,
  ): doc is QuestionResponse {
    return doc === null || (doc && 'title' in doc && 'tags' in doc && 'askedBy' in doc);
  }

  /**
   * Type guard to check if a document is a valid TagResponse.
   *
   * @param doc The document to check.
   *
   * @returns `true` if the document is a valid TagResponse, otherwise `false`.
   */
  function isTagResponse(
    doc: QuestionResponse | AnswerResponse | TagResponse | null,
  ): doc is TagResponse {
    return doc === null || (doc && 'name' in doc && 'description' in doc);
  }

  /**
   * Handles adding a new user as a subscriber to the specified question. The user is first validated.
   * If the user is invalid the HTTP response status is updated.
   *
   * @param req The AddUserRequest object containing the comment data.
   * @param res The HTTP response object used to send back the result of the operation.
   * @param type The type of the comment, either 'question' or 'answer'.
   *
   * @returns A Promise that resolves to void.
   */
  const toggleSubscriberRoute = async (
    req: ToggleSubscriberRequest,
    res: Response,
  ): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    const { type } = req.body;

    if (type !== 'question' && type !== 'tag') {
      res.status(400).send('Invalid type');
      return;
    }

    const { user } = req.body;

    if (!isUserValid(user)) {
      res.status(400).send('Invalid user body');
      return;
    }

    try {
      const status = await toggleSubscribe(id, type, user);

      if (status && 'error' in status) {
        throw new Error(status.error);
      }

      // Populates the fields of the question or tag that this subscriber
      // was added to, and emits the updated object
      const populatedDoc = await populateDocument(id, type);

      if (populatedDoc && 'error' in populatedDoc) {
        throw new Error(populatedDoc.error);
      }

      // Type guard to ensure populatedDoc is of type QuestionResponse
      if (populatedDoc && (isQuestionResponse(populatedDoc) || isTagResponse(populatedDoc))) {
        socket.emit('subscriberUpdate', {
          result: populatedDoc,
          type,
        });
        res.json(populatedDoc);
      } else {
        throw new Error('Populated document is not a valid QuestionResponse');
      }
    } catch (err: unknown) {
      res.status(500).send(`Error when adding subscriber: ${(err as Error).message}`);
    }
  };

  router.post('/toggleSubscribe', toggleSubscriberRoute);

  return router;
};

export default subscribeController;
