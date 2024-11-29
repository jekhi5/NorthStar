import { useEffect, useState } from 'react';
import { getUserByUid } from '../services/userService';
import { User, UserData } from '../types';

/**
 * Custom hook to handle fetching user details by uid.
 *
 * @param uid - The uid of the user to fetch.
 *
 * @returns user - The user object.
 * @returns setUser - Setter to manually update the user state if needed.
 */
const useUserSelected = (userData: UserData) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUserByUid(userData.uid);
        // Want to make sure `undefined` isn't passed through, only null
        setUser(res || null);
      } catch (error) {
        // We log the errors here, but we do not throw an error as we do not want to block the
        // user from viewing the site just because the user failed to be found.
        if (error instanceof Error) {
          // eslint-disable-next-line no-console
          console.error('Error fetching user:', error.message);
        } else {
          // eslint-disable-next-line no-console
          console.error('Error fetching user:', error);
        }
      }
    };
    fetchData();
  }, [userData.uid]);

  return {
    user,
    setUser,
  };
};

export default useUserSelected;
