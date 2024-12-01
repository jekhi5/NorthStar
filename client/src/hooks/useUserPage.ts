import { useEffect, useState } from 'react';
import { UserData } from '../types';
import { getUsers } from '../services/userService';

/**
 * Custom hook for managing the user page's state and navigation.
 *
 * @returns userList - An array of user's data retrieved from the server
 * @returns leaderboardList - An array of user's data retrieved from the server
 */
const useUserPage = () => {
  const [userList, setUserList] = useState<UserData[]>([]);
  const [leaderboardList, setLeaderBoardList] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUsers();
        setUserList(res || []);
      } catch (error) {
        // We log the errors here, but we do not throw an error as we do not want to block the
        // user from viewing the site just because the user failed to be found.
        if (error instanceof Error) {
          // eslint-disable-next-line no-console
          console.error('Error fetching users:', error.message);
        } else {
          // eslint-disable-next-line no-console
          console.error('Error fetching users');
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Fetch leaderboard data
    const fetchLeaderboardData = async () => {
      try {
        const res = await getUsers();
        const topContributors = [...res].sort((a, b) => b.reputation - a.reputation).slice(0, 5);
        setLeaderBoardList(topContributors || []);
      } catch (error) {
        if (error instanceof Error) {
          // eslint-disable-next-line no-console
          console.error('Error fetching leaderboard:', error.message);
        } else {
          // eslint-disable-next-line no-console
          console.error('Error fetching leaderboard');
        }
      }
    };

    fetchLeaderboardData();
  }, []);

  return { userList, leaderboardList };
};

export default useUserPage;
