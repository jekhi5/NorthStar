import useUserPage from '../../../hooks/useUserPage';
import './index.css';
import UserView from './user';

/**
 * Represents the UsersPage component which displays a scrollable list of users
 * on the left side and a leaderboard on the right.
 */
const UsersPage = () => {
  const { userList, leaderboardList } = useUserPage();

  return (
    <div className='users-page'>
      <div className='users-header'>
        <div className='left'>
          <div className='bold_title'>{userList.length} Users</div>
          <div className='bold_title'>All Users</div>
        </div>
        <div className='right'>
          <div className='bold_title'>Leaderboard</div>
          <div className='bold_title'>Top Users</div>
        </div>
      </div>
      <div className='users-content'>
        <div className='user-list-container'>
          <div className='user-list'>
            {userList.map((user, index) =>
              user ? <UserView key={index} userData={user} /> : null,
            )}
          </div>
        </div>
        <div className='leaderboard'>
          <div className='leaderboard-group'>
            {leaderboardList.map((user, index) =>
              user ? <UserView key={index} userData={user} /> : null,
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
