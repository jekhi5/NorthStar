import express, { Request, Response } from 'express';
import UserModel from '../models/user';
import { User } from '../types';
import { saveUser } from '../models/application';

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
   * Checks if a username and email is available (not already taken).
   *
   * @param req The request object containing the username and email as a parameter.
   * @param res The response object to send the result.
   */
  const checkValidUser = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    const { email } = req.params;

    try {
      const usernameCheck = await UserModel.findOne({ username });
      const emailCheck = await UserModel.findOne({ email });

      if (usernameCheck && emailCheck) {
        // Username and email are both taken
        res.json({
          available: false,
          message: 'Both username and email are already in use (perhaps try logging in instead)',
        });
      } else if (usernameCheck) {
        // Just username is taken
        res.json({ available: false, message: 'Username is already in use' });
      } else if (emailCheck) {
        // Just email is taken
        res.json({
          available: false,
          message: 'Email is already in use (perhaps try logging in instead)',
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
  router.get('/checkValidUser/:username/:email', checkValidUser);
  router.post('/addUser', addUser);

  return router;
};

export default userController;
