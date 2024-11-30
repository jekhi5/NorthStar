import './index.css';
import { NavLink } from 'react-router-dom';
import defaultProfilePic from '../../../../images/default-profile-pic.png';
import useUserSelected from '../../../../hooks/useUserSelected';
import { UserData } from '../../../../types';

/**
 * User component that displays information about a specific user.
 * The component displays the user's username, status, and profile picture
 * It also navigates to their profile page when clicked.
 *
 * @param uid - The uid of the user to display.
 */
const UserView = ({ userData }: { userData: UserData }) => {
  const { user } = useUserSelected(userData);

  if (!user) {
    return <></>;
  }

  const profilePic = user.profilePicture === '' ? defaultProfilePic : user.profilePicture;

  return (
    <NavLink to={`/profile/${user.username}`} className='userLink'>
      <div className='userNode'>
        <div className='user-info'>
          <img src={profilePic ?? defaultProfilePic} alt='Profile' className='profile-picture' />
          <span className='username'>{user.username}</span>
          <div
            className={`question_author_status status-${user.status.toLowerCase().replace(' ', '-')}`}>
            {user.status}
          </div>
          <span className='user-rep'>Points: {user.reputation}</span>
        </div>
      </div>
    </NavLink>
  );
};

export default UserView;
