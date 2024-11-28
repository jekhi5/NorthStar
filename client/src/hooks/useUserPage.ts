import { useEffect, useState } from 'react';
import { UserData } from '../types';
import { getUsers } from '../services/userService';

/**
 * Custom hook for managing the user page's state and navigation.
 *
 * @returns userList - An array of user's data retrieved from the server
 * @returns clickTag - Function to navigate to the home page with the selected tag as a URL parameter.
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
        res.sort((user1, user2) => user2.reputation - user1.reputation);
        const topContributors = res.slice(0, 10);
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
