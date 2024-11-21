import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  Question,
  FindQuestionRequest,
  FindQuestionByIdRequest,
  FindQuestionsByUserIdRequest,
  AddQuestionRequest,
  VoteRequest,
  FakeSOSocket,
  User,
  PostNotificationResponse,
} from '../types';
import {
  addVoteToQuestion,
  fetchAndIncrementQuestionViewsById,
  filterQuestionsByAskedBy,
  filterQuestionsBySearch,
  getQuestionsByOrder,
  processTags,
  populateDocument,
  saveQuestion,
  getQuestionsByAskedByUserId,
  getQuestionsByAnsweredByUserId,
  postNotifications,
} from '../models/application';

const questionController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Retrieves a list of questions filtered by a search term and ordered by a specified criterion.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindQuestionRequest object containing the query parameters `order` and `search`.
   * @param res The HTTP response object used to send back the filtered list of questions.
   *
   * @returns A Promise that resolves to void.
   */
  const getQuestionsByFilter = async (req: FindQuestionRequest, res: Response): Promise<void> => {
    const { order } = req.query;
    const { search } = req.query;
    const { askedBy } = req.query;
    try {
      let qlist: Question[] = await getQuestionsByOrder(order);
      // Filter by askedBy if provided
      if (askedBy) {
        qlist = filterQuestionsByAskedBy(qlist, askedBy);
      }
      // Filter by search keyword and tags
      const resqlist: Question[] = await filterQuestionsBySearch(qlist, search);
      res.json(resqlist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching questions by filter: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching questions by filter`);
      }
    }
  };

  /**
   * Retrieves a question by its unique ID, and increments the view count for that question.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindQuestionByIdRequest object containing the question ID as a parameter.
   * @param res The HTTP response object used to send back the question details.
   *
   * @returns A Promise that resolves to void.
   */
  const getQuestionById = async (req: FindQuestionByIdRequest, res: Response): Promise<void> => {
    const { qid } = req.params;
    const { uid } = req.query;

    if (!ObjectId.isValid(qid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    if (uid === undefined || uid === '') {
      res.status(400).send('Invalid user requesting question.');
      return;
    }

    try {
      const q = await fetchAndIncrementQuestionViewsById(qid, uid);

      if (q && !('error' in q)) {
        socket.emit('viewsUpdate', q);
        res.json(q);
        return;
      }

      throw new Error('Error while fetching question by id');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching question by id: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching question by id`);
      }
    }
  };

  /**
   * Retrieves a list of questions by its poster's user uid.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindQuestionByIdRequest object containing the poster's user uid as a parameter.
   * @param res The HTTP response object used to send back the question details.
   *
   * @returns A Promise that resolves to void.
   */
  const getQuestionsByAskedBy = async (
    req: FindQuestionsByUserIdRequest,
    res: Response,
  ): Promise<void> => {
    const { userId } = req.query;

    if (userId === undefined || userId === '') {
      res.status(400).send('Invalid id.');
      return;
    }

    try {
      const questions = await getQuestionsByAskedByUserId(userId);

      if (questions && !('error' in questions)) {
        socket.emit('questionsUpdate', questions);
        res.json(questions);
        return;
      }

      throw new Error('Error while fetching questions by user id');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching questions by user id: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching questions by user id`);
      }
    }
  };

  /**
   * Retrieves a list of questions by the given user id correlating to a potential answerer of said questions.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindQuestionsByUserIdRequest object containing the user id as a parameter.
   * @param res The HTTP response object used to send back the question details.
   *
   * @returns A Promise that resolves to void.
   */
  const getQuestionsByAnsBy = async (
    req: FindQuestionsByUserIdRequest,
    res: Response,
  ): Promise<void> => {
    const { userId } = req.query;

    if (userId === undefined || userId === '') {
      res.status(400).send('Invalid user id.');
      return;
    }

    try {
      const questions = await getQuestionsByAnsweredByUserId(userId);

      if (questions && !('error' in questions)) {
        socket.emit('questionsUpdate', questions);
        res.json(questions);
        return;
      }

      throw new Error('Error while fetching questions by user id');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching questions by user id: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching questions by user id`);
      }
    }
  };

  /**
   * Validates the question object to ensure it contains all the necessary fields.
   *
   * @param question The question object to validate.
   *
   * @returns `true` if the question is valid, otherwise `false`.
   */
  const isQuestionBodyValid = (question: Question): boolean =>
    question.title !== undefined &&
    question.title !== '' &&
    question.text !== undefined &&
    question.text !== '' &&
    question.tags !== undefined &&
    question.tags.length > 0 &&
    question.askedBy !== undefined &&
    question.askedBy.uid !== undefined &&
    question.askDateTime !== undefined &&
    question.askDateTime !== null;

  /**
   * Adds a new question to the database. The question is first validated and then saved.
   * If the tags are invalid or saving the question fails, the HTTP response status is updated.
   *
   * @param req The AddQuestionRequest object containing the question data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addQuestion = async (req: AddQuestionRequest, res: Response): Promise<void> => {
    if (!isQuestionBodyValid(req.body)) {
      res.status(400).send('Invalid question body');
      return;
    }
    const question: Question = req.body;
    try {
      const processedTags = await processTags(question.tags);
      const subscribersFromTags: User[] = processedTags
        .map(tag => tag.subscribers)
        .flat()
        .filter(
          (subscriber): subscriber is User =>
            typeof subscriber !== 'string' && subscriber instanceof Object,
        )
        .filter(
          (subscriber, index, self) => index === self.findIndex(s => s.uid === subscriber.uid),
        );

      const { askedBy } = question;
      const questionswithtags: Question = {
        ...question,
        tags: processedTags,
        subscribers: subscribersFromTags.includes(askedBy)
          ? subscribersFromTags
          : [askedBy, ...subscribersFromTags],
      };
      if (questionswithtags.tags.length === 0) {
        throw new Error('Invalid tags');
      }
      const result = await saveQuestion(questionswithtags);
      if ('error' in result) {
        throw new Error(result.error);
      }

      // Populates the fields of the question that was added, and emits the new object
      const populatedQuestion = await populateDocument(result._id?.toString(), 'question');

      if (populatedQuestion && 'error' in populatedQuestion) {
        throw new Error(populatedQuestion.error);
      }

      if (populatedQuestion._id) {
        const newNotification: PostNotificationResponse = await postNotifications(
          populatedQuestion._id?.toString(),
          'questionPostedWithTag',
          askedBy,
          populatedQuestion._id?.toString(),
        );

        if (newNotification && !('error' in newNotification)) {
          socket.emit('postNotificationUpdate', {
            notification: newNotification,
            type: 'newNotification',
          });
        }
      }

      socket.emit('questionUpdate', populatedQuestion as Question);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving question: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving question`);
      }
    }
  };

  /**
   * Helper function to handle upvoting or downvoting a question.
   *
   * @param req The VoteRequest object containing the question ID and the uid of the user.
   * @param res The HTTP response object used to send back the result of the operation.
   * @param type The type of vote to perform (upvote or downvote).
   *
   * @returns A Promise that resolves to void.
   */
  const voteQuestion = async (
    req: VoteRequest,
    res: Response,
    type: 'upvote' | 'downvote',
  ): Promise<void> => {
    if (!req.body.id || !req.body.uid) {
      res.status(400).send('Invalid request');
      return;
    }

    const { id, uid } = req.body;

    try {
      let status;
      if (type === 'upvote') {
        status = await addVoteToQuestion(id, uid, type);
      } else {
        status = await addVoteToQuestion(id, uid, type);
      }

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      // Emit the updated vote counts to all connected clients
      socket.emit('voteUpdate', {
        id,
        upVotes: status.upVotes,
        downVotes: status.downVotes,
        type: 'Question',
      });

      if (status.upvoteNotification) {
        socket.emit('postNotificationUpdate', {
          notification: status.upvoteNotification,
          type: 'newNotification',
        });
      }
      res.json({ msg: status.msg, upVotes: status.upVotes, downVotes: status.downVotes });
    } catch (err) {
      res.status(500).send(`Error when ${type}ing: ${(err as Error).message}`);
    }
  };

  /**
   * Handles upvoting a question. The request must contain the question ID (qid) and the username.
   * If the request is invalid or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The VoteRequest object containing the question ID and the username.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const upvoteQuestion = async (req: VoteRequest, res: Response): Promise<void> => {
    voteQuestion(req, res, 'upvote');
  };

  /**
   * Handles downvoting a question. The request must contain the question ID (qid) and the uid of the user.
   * If the request is invalid or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The VoteRequest object containing the question ID and the username.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const downvoteQuestion = async (req: VoteRequest, res: Response): Promise<void> => {
    voteQuestion(req, res, 'downvote');
  };

  // add appropriate HTTP verbs and their endpoints to the router
  router.get('/getQuestion', getQuestionsByFilter);
  router.get('/getQuestionById/:qid', getQuestionById);
  router.get('/getQuestionsByAskedByUserId', getQuestionsByAskedBy);
  router.get('/getQuestionsByAnsweredByUserId', getQuestionsByAnsBy);
  router.post('/addQuestion', addQuestion);
  router.post('/upvoteQuestion', upvoteQuestion);
  router.post('/downvoteQuestion', downvoteQuestion);

  return router;
};

export default questionController;
