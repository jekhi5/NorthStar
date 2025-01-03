import express, { Request, Response } from 'express';
import UserModel from '../models/user';
import { editUser, saveUser } from '../models/application';
import { PostNotification, User } from '../types';
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
      const user = await UserModel.findOne({ uid }).populate([
        {
          path: 'postNotifications.postNotification',
          model: PostNotificationModel,
          populate: { path: 'fromUser', model: UserModel },
        },
      ]);

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
   * Retrieves a user by their username.
   *
   * @param req The request object containing the username as a parameter.
   * @param res The response object to send the result.
   */
  const getUserByUsername = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;

    try {
      const user = await UserModel.findOne({ username }).populate([
        {
          path: 'postNotifications.postNotification',
          model: PostNotificationModel,
          populate: { path: 'fromUser', model: UserModel },
        },
      ]);

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
   * Checks if a username and email are available (not already taken).
   * If provided with a user's id, excludes that user's username and email (for profile updates).
   *
   * @param req The request object containing the username, email, and optionally id.
   * @param res The response object to send the result.
   */
  const checkValidUser = async (req: Request, res: Response): Promise<void> => {
    const { username, email } = req.params;
    const { userId } = req.query;

    try {
      const usernameCheck = await UserModel.findOne({
        username,
        ...(userId && { _id: { $ne: userId } }), // Don't check for this user's username
      });
      const emailCheck = await UserModel.findOne({
        email,
        ...(userId && { _id: { $ne: userId } }), // Don't check for this user's email
      });

      if (usernameCheck && emailCheck) {
        // Username and email are both taken
        res.json({
          available: false,
          message: 'Both username and email are already in use',
        });
      } else if (usernameCheck) {
        // Just username is taken
        res.json({ available: false, message: 'Username is already in use' });
      } else if (emailCheck) {
        // Just email is taken
        res.json({
          available: false,
          message: 'Email is already in use',
        });
      } else {
        // The username and email are both available, and therefore the user is valid
        res.json({ available: true, message: 'User is valid' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error checking username and email availability' });
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
      try {
        const welcomeNotification: PostNotification | null = await PostNotificationModel.findOne({
          title: 'Welcome to North Star!',
          text: 'Our app is still in development, so please be patient with us. Feel free to ask questions, provide answers, and reach out with any issues you encounter. We hope to be your guiding light!',
          notificationType: 'welcomeNotification',
        });

        if (welcomeNotification) {
          user.postNotifications = [{ postNotification: welcomeNotification, read: false }];
        } else {
          const newWelcomeNotification = await PostNotificationModel.create({
            title: 'Welcome to North Star!',
            text: 'Our app is still in development, so please be patient with us. Feel free to ask questions, provide answers, and reach out with any issues you encounter. We hope to be your guiding light!',
            notificationType: 'welcomeNotification',
          });
          if (newWelcomeNotification) {
            user.postNotifications = [{ postNotification: newWelcomeNotification, read: false }];
          }
        }
      } catch (error) {
        // We log the errors here, but we do not throw an error as we do not want to block the
        // user from being added just because the welcome notification failed to load.
        if (error instanceof Error) {
          // eslint-disable-next-line no-console
          console.error('Error fetching welcome notification:', error.message);
        } else {
          // eslint-disable-next-line no-console
          console.error('Error fetching welcome notification:');
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

  /**
   * Updates a user's information in the database.
   *
   * @param req The request object containing the user details.
   * @param res The response object to send the result.
   */
  const updateUser = async (req: Request, res: Response): Promise<void> => {
    const user: User = req.body;

    if (!isUserValid(user)) {
      res.status(400).send('Invalid user data');
      return;
    }

    try {
      const result = await editUser(user);
      if ('error' in result) {
        throw new Error(result.error);
      }

      res.status(201).json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when updating user: ${err.message}`);
      } else {
        res.status(500).send('Error when updating user');
      }
    }
  };

  /**
   * Retrieves a list of users' data from the database.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param _ The HTTP request object (not used in this function).
   * @param res The HTTP response object used to send back the user data.
   *
   * @returns A Promise that resolves to void.
   */
  const getUsers = async (_: Request, res: Response): Promise<void> => {
    try {
      const users = await UserModel.find();
      if (!users) {
        throw new Error('Error while fetching users');
      } else {
        res.json(
          users.map(user => ({
            uid: user.uid,
            username: user.username,
            profilePicture: user.profilePicture,
            status: user.status,
            reputation: user.reputation,
          })),
        );
      }
    } catch (err) {
      res.status(500).send(`Error when fetching users: ${(err as Error).message}`);
    }
  };

  router.get('/getUserByUid/:uid', getUserByUid);
  router.get('/getUserByUsername/:username', getUserByUsername);
  router.get('/checkValidUser/:username/:email', checkValidUser);
  router.post('/addUser', addUser);
  router.put('/updateUser', updateUser);
  router.get('/getUsers', getUsers);

  return router;
};

export default userController;
