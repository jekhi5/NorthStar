import { NavLink } from 'react-router-dom';
import useProfilePage from '../../../hooks/useProfilePage';
import './index.css';

const ProfilePage = () => {
  const {
    profile,
    editedProfile,
    error,
    userQuestions,
    userAnswers,
    updateError,
    isEditing,
    toggleEditing,
    handleChange,
    saveProfile,
    handleProfilePictureUpload,
    calculateReputationPercentage,
  } = useProfilePage();

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
        {isEditing ? (
          <div className='profile-edit-form'>
            <input
              type='text'
              value={editedProfile?.firstName || ''}
              onChange={e => handleChange('firstName', e.target.value)}
              placeholder='First Name'
            />
            <input
              type='text'
              value={editedProfile?.lastName || ''}
              onChange={e => handleChange('lastName', e.target.value)}
              placeholder='Last Name'
            />
            <input
              type='text'
              value={editedProfile?.username || ''}
              onChange={e => handleChange('username', e.target.value)}
              placeholder='Username'
            />
            <input
              type='email'
              value={editedProfile?.email || ''}
              onChange={e => handleChange('email', e.target.value)}
              placeholder='Email'
            />
            <input
              type='file'
              accept='image/*'
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  handleProfilePictureUpload(e.target.files[0]);
                }
              }}
            />
            <button onClick={saveProfile}>Save Changes</button>
            <button onClick={toggleEditing}>Cancel</button>
            {updateError && <p>{updateError}</p>}
          </div>
        ) : (
          <div className='profile-info'>
            {profile.profilePicture && (
              <img src={profile.profilePicture} alt='Profile' className='profile-picture' />
            )}
            <h2 className='profile-name'>
              {profile.firstName} {profile.lastName}
            </h2>
            <p className='profile-username'>Username: {profile.username}</p>
            <p className='profile-email'>Email: {profile.email}</p>
            <div className='profile-status'>
              <ul>
                <li>
                  Progress towards Endorsed: {calculateReputationPercentage(profile.reputation, 30)}
                  %
                </li>
                <li>
                  Progress towards Super Smarty Pants:{' '}
                  {calculateReputationPercentage(profile.reputation, 100)}%
                </li>
                <li>
                  Progress towards Mentor: {calculateReputationPercentage(profile.reputation, 500)}%
                </li>
                <li>
                  Progress towards Grandmaster:{' '}
                  {calculateReputationPercentage(profile.reputation, 1000)}%
                </li>
              </ul>
            </div>
            <button onClick={toggleEditing}>Edit Profile</button>
          </div>
        )}
        <h2 className='profile-questionsasked'>Questions Asked</h2>
        {userQuestions.length > 0 ? (
          userQuestions.map((q, index) => (
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
        <h2 className='profile-questionsanswered'>Questions Answered</h2>
        {userAnswers.length > 0 ? (
          userAnswers.map((a, index) => (
            <li key={index} className='question-item'>
              <NavLink
                to={`/question/${a._id}`}
                id='answered_view'
                className={({ isActive }) => `answered_button ${isActive ? 'answered' : ''}`}>
                {a.title}
              </NavLink>
            </li>
          ))
        ) : (
          <p className='no-answers'>No answers yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
