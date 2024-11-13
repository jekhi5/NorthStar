import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import UserModel from '../models/user';
import { PostNotification, Question, User } from '../types';
import { saveUser } from '../models/application';
import QuestionModel from '../models/questions';
import PostNotificationModel from '../models/postNotifications';

const userController = () => {
  const router = express.Router();

  const isUserValid = (user: User): boolean =>
    user.uid !== undefined &&
    user.uid !== '' &&
    user.username !== undefined &&
    user.username !== '' &&
    user.email !== undefined &&
    user.email !== '';
  /**
   * Retrieves a user by their UID.
   *
   * @param req The request object containing the UID as a parameter.
   * @param res The response object to send the result.
   */
  const getUserByUid = async (req: Request, res: Response): Promise<void> => {
    const { uid } = req.params;

    try {
      const user = await UserModel.findOne({ uid });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  };

  /**
   * Checks if a username is available (not already taken).
   *
   * @param req The request object containing the username as a parameter.
   * @param res The response object to send the result.
   */
  const checkUsernameAvailability = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;

    try {
      const user = await UserModel.findOne({ username });

      if (user) {
        // Username is taken
        res.json({ available: false, message: 'Username is already taken' });
      } else {
        // Username is available
        res.json({ available: true, message: 'Username is available' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error checking username availability' });
    }
  };

  /**
   * Adds a new user to the database.
   *
   * @param req The request object containing the user details.
   * @param res The response object to send the result.
   */
  const addUser = async (req: Request, res: Response): Promise<void> => {
    const user: User = req.body;

    if (!isUserValid(user)) {
      res.status(400).send('Invalid user data');
      return;
    }

    try {
      const fakeStackOverflowUser: User | null = await UserModel.findOne({
        username: 'FakeStackOverflowTeam',
      });

      const fakeStackOverflowWelcomeQuestion: Question | null = await QuestionModel.findOne({
        title: 'Welcome to Fake Stack Overflow!',
      });

      // If we can find the fake stack overflow user and welcome question,
      // we attempt to add the notification to the database.
      // If that is successful, then we add that notification to the user
      if (
        fakeStackOverflowUser &&
        fakeStackOverflowWelcomeQuestion &&
        fakeStackOverflowWelcomeQuestion._id instanceof ObjectId
      ) {
        const welcomeNotificationObject: PostNotification = {
          title: 'Welcome to Fake Stack Overflow!',
          text: 'Our app is still in development, so please be patient with us. Feel free to ask questions, provide answers, and reach out with any issues you encounter.',
          postType: 'Question',
          postId: fakeStackOverflowWelcomeQuestion._id,
          fromUser: fakeStackOverflowUser,
        };

        const welcomeNotification: PostNotification =
          await PostNotificationModel.create(welcomeNotificationObject);

        if (welcomeNotification) {
          user.postNotifications = [welcomeNotification];
        }
      }

      const result = await saveUser(user);
      if ('error' in result) {
        throw new Error(result.error);
      }

      res.status(201).json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when adding user: ${err.message}`);
      } else {
        res.status(500).send('Error when adding user');
      }
    }
  };

  router.get('/getUserByUid/:uid', getUserByUid);
  router.get('/checkUsernameAvailability/:username', checkUsernameAvailability);
  router.post('/addUser', addUser);

  return router;
};

export default userController;
