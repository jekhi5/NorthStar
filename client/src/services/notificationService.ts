import { PostNotification } from '../types';
import api from './config';

const NOTIFICATION_API_URL = `${process.env.REACT_APP_SERVER_URL}/notification`;

/**
 * Retrieves a list of notifications from the database by a user's UID.
 *
 * @param uid - The unique identifier of the user.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 *
 * @returns The notification list object.
 */
const getNotificationsByUid = async (uid: string): Promise<PostNotification[] | null> => {
  const res = await api.get(`${NOTIFICATION_API_URL}/getNotificationsByUid/${uid}`);
  if (res.status === 404) {
    throw new Error(`Could not find user ${uid}`);
  }
  if (res.status === 500) {
    throw new Error('Error while fetching notifications');
  }

  return res.data;
};

export default getNotificationsByUid;
