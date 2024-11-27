import useUserPage from '../../../hooks/useUserPage';
import './index.css';
import UserView from './user';

/**
 * Represents the UserPage component which displays a grid of all users
 * and provides functionality to handle user clicks.
 */
const UserPage = () => {
  const { userList } = useUserPage();

  return (
    <>
      <div className='space_between right_padding'>
        <div className='bold_title'>{userList.length} Users</div>
        <div className='bold_title'>All Users</div>
      </div>
      <div className='user_list right_padding'>
        {userList.map((user, index) => (
          <UserView key={index} userData={user} />
        ))}
      </div>
    </>
  );
};

export default UserPage;
