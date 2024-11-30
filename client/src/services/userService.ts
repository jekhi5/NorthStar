import { User, UserData } from '../types';
import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Adds a new user to the database.
 *
 * @param user - The user object containing the user details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const addUser = async (user: User): Promise<User> => {
  const res = await api.post(`${USER_API_URL}/addUser`, user);
  if (res.status !== 200 && res.status !== 201) {
    throw new Error('Error while creating a new user');
  }
  return res.data;
};

/**
 * Checks if a username and email is available.
 *
 * @param username - The username to check for availability.
 * @param email - The email to check for availability.
 * @param _id - (Optional) The id of the current user to exclude from the check.
 * @returns An object containing a boolean indicating whether the username and email are both
 * available (true) or taken (false) and the associated message to display to the user.
 * @throws Error if there's an issue checking username or email availability.
 */
const checkValidUser = async (
  username: string,
  email: string,
  _id?: string,
): Promise<{ available: boolean; message: string }> => {
  const queryParams = new URLSearchParams();
  // If an id was passed in, add it to query parameters
  if (_id) {
    queryParams.append('userId', _id);
  }
  const res = await api.get(
    `${USER_API_URL}/checkValidUser/${encodeURIComponent(username)}/${encodeURIComponent(email)}?${queryParams.toString()}`,
  );
  if (res.status === 500) {
    throw new Error('Error while checking username and email availability');
  }

  // If we get here, it means the request was successful
  return res.data;
};

/**
 * Retrieves a user from the database by their UID.
 *
 * @param uid - The unique identifier of the user.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 *
 * @returns The user object.
 */
const getUserByUid = async (uid: string): Promise<User | null> => {
  const res = await api.get(`${USER_API_URL}/getUserByUid/${uid}`);
  if (res.status === 404) {
    throw new Error(`Could not find user ${uid}`);
  }
  if (res.status === 500) {
    throw new Error('Error while fetching user');
  }

  return res.data;
};

/**
 * Retrieves a user from the database by their username.
 *
 * @param username - The unique username of the user.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 *
 * @returns The user object.
 */
const getUserByUsername = async (username: string): Promise<User | null> => {
  const res = await api.get(`${USER_API_URL}/getUserByUsername/${username}`);
  if (res.status === 404) {
    throw new Error(`Could not find user ${username}`);
  }
  if (res.status === 500) {
    throw new Error('Error while fetching user');
  }

  return res.data;
};

/**
 * Updates an existing user in the database.
 *
 * @param user - The user object containing the updated user details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const updateUser = async (user: User): Promise<User> => {
  const res = await api.put(`${USER_API_URL}/updateUser`, user);
  if (res.status !== 201) {
    throw new Error('Error while updating user');
  }
  return res.data;
};

/**
 * Function to get tags with the number of associated questions.
 *
 * @throws Error if there is an issue fetching users from server.
 */
const getUsers = async (): Promise<UserData[]> => {
  const res = await api.get(`${USER_API_URL}/getUsers`);
  if (res.status !== 200) {
    throw new Error('Error when fetching users');
  }
  return res.data;
};

export { addUser, checkValidUser, getUserByUid, updateUser, getUserByUsername, getUsers };
