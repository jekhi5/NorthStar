import { NavLink } from 'react-router-dom';
import useProfilePage from '../../../hooks/useProfilePage';

/**
 * ProfilePage component that displays a user's personal information.
 */
const ProfilePage = () => {
  const { profile, error, userquestions } = useProfilePage();

  if (error) {
    return <p>{error}</p>;
  }

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className='profile-page'>
      <h1 className='profile-title'>Profile</h1>

      <div className='profile-details'>
        {profile.profilePicture && (
          <img src={profile.profilePicture} alt='Profile' className='profile-picture' />
        )}

        <div className='profile-info'>
          <h2 className='profile-name'>
            {profile.firstName} {profile.lastName}
          </h2>
          <p className='profile-username'>Username: {profile.username}</p>
          <p className='profile-email'>Email: {profile.email}</p>
          <p className='profile-status'>Status: {profile.status}</p>
          <h2 className='profile-name'>Questions Asked</h2>
        </div>
        {userquestions.length > 0 ? (
          userquestions.map((q, index) => (
            <li key={index} className='question-item'>
              <NavLink
                to={`/question/${q._id}`}
                id='question_view'
                className={({ isActive }) =>
                  `question_button ${isActive ? 'question_selected' : ''}`
                }>
                {q.title}
              </NavLink>
            </li>
          ))
        ) : (
          <p className='no-questions'>No questions yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
