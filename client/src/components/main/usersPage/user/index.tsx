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

  const profilePic = user.profilePicture === '' ? defaultProfilePic : user.profilePicture;

  return (
    <NavLink to={`/profile/${user.username}`} className='userLink'>
      <div className='userNode'>
        <img src={profilePic ?? defaultProfilePic} alt='Profile' className='profile-picture' />
        <div className='user-info'>
          <div className='username'>{user.username}</div>
          <div
            className={`question_author_status status-${user.status.toLowerCase().replace(' ', '-')}`}>
            {user.status}
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default UserView;
