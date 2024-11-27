import './index.css';
import { NavLink } from 'react-router-dom';
import defaultProfilePic from '../../../../images/default-profile-pic.png';
import useUserSelected from '../../../../hooks/useUserSelected';
import { UserData } from '../../../../types';

/**
 * User component that displays information about a specific user.
 * The component displays the user's username, role, and profile picture
 * It also navigates to their profile page when clicked.
 *
 * @param uid - The uid of the user to display.
 */
const UserView = ({ userData }: { userData: UserData }) => {
  const { user } = useUserSelected(userData);

  const profilePic = user.profilePicture === '' ? defaultProfilePic : user.profilePicture;

  return (
    <div className='userNode'>
      <NavLink to={`/profile/${user.uid}`}>
        <div className='username'>{user.username}</div>
        <img src={profilePic ?? defaultProfilePic} alt='Profile' className='profile-picture' />
        <div
          className={`question_author_status status-${user.status.toLowerCase().replace(' ', '-')}`}>
          {user.status}
        </div>
      </NavLink>
    </div>
  );
};

export default UserView;
