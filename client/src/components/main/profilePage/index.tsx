import { NavLink, useParams } from 'react-router-dom';
import useProfilePage from '../../../hooks/useProfilePage';
import './index.css';
import defaultProfilePic from '../../../images/default-profile-pic.png';
import useUserContext from '../../../hooks/useUserContext';

const ProfilePage = () => {
  // Get uid from route to determine if this is the page of the current user
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useUserContext();
  const isCurrentUser = username === currentUser?.username;

  const {
    profile,
    editedProfile,
    error,
    userQuestions,
    userAnswers,
    updateError,
    isEditing,
    emailOpted,
    optButtonText,
    toggleEditing,
    handleChange,
    saveProfile,
    handleProfilePictureUpload,
    calculateReputationPercentage,
    toggleEmailOptIn,
  } = useProfilePage(username);

  if (error) {
    return <p>{error}</p>;
  }

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  const profilePic = profile?.profilePicture === '' ? defaultProfilePic : profile?.profilePicture;

  return (
    <div className='profile-page'>
      {isCurrentUser ? (
        <h1 className='profile-title'>Hey there {profile.firstName}!</h1>
      ) : (
        <h1 className='profile-title'>@{profile.username}</h1>
      )}
      <div className='profile-container'>
        <div className='profile-left'>
          <img src={profilePic ?? defaultProfilePic} alt='Profile' className='profile-picture' />
          <h2 className='profile-name'>
            {profile.firstName} {profile.lastName}
          </h2>
          <div className='profile-status'>
            <p>{profile.status}</p>
          </div>

          {/* Only show info & allow edits & email opt in if this is current user's profile */}
          {isCurrentUser && (
            <>
              <p className='profile-username'>Username: {profile.username}</p>
              <p className='profile-email'>Email: {profile.email}</p>
              <div className='profile-button-group'>
              <button onClick={toggleEditing}>Edit Profile</button>
                <button
                  className={`${emailOpted ? 'emailopt-button-disable' : 'emailopt-button-enable'}`}
                  onClick={toggleEmailOptIn}>
                  {optButtonText}
                </button>
              </div>
            </>
          )}
        </div>
        {/* Only show profile details is the current user's profile */}
        {isCurrentUser && (
          <div className='profile-details'>
            {isEditing ? (
              <div className='profile-edit-form'>
                <input
                  type='text'
                  value={editedProfile?.firstName || ''}
                  onChange={e => handleChange('firstName', e.target.value)}
                  placeholder='First Name'
                  className='profile-edit-input'
              />
                <input
                  type='text'
                  value={editedProfile?.lastName || ''}
                  onChange={e => handleChange('lastName', e.target.value)}
                  placeholder='Last Name'
                  className='profile-edit-input'
              />
                <input
                  type='text'
                  value={editedProfile?.username || ''}
                  onChange={e => handleChange('username', e.target.value)}
                  placeholder='Username'
                  className='profile-edit-input'
              />
                <input
                  type='email'
                  value={editedProfile?.email || ''}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder='Email'
                  className='profile-edit-input'
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
                <div className='edit-profile-buttons'>
                <button onClick={saveProfile}>Save Changes</button>
                  <button onClick={toggleEditing}>Cancel</button>
                </div>
              {updateError && <p>{updateError}</p>}
              </div>
            ) : (
              <div className='profile-info'>
                <div className='profile-right'>
                  <div className='progress-bars'>
                    <div className='progress-item'>
                      <span>Progress towards Endorsed</span>
                      <div className='progress-bar'>
                        <div
                          className='progress-fill'
                          style={{
                            width: `${calculateReputationPercentage(profile.reputation, 30)}%`,
                          }}
                          data-completion={
                            `${calculateReputationPercentage(profile.reputation, 30)}` === '100'
                              ? '100'
                              : ''
                          }
                        />
                      </div>
                      <span>{calculateReputationPercentage(profile.reputation, 30)}%</span>
                    </div>

                    <div className='progress-item'>
                      <span> Progress towards Super Smarty Pants</span>
                      <div className='progress-bar'>
                        <div
                          className='progress-fill'
                          style={{
                            width: `${calculateReputationPercentage(profile.reputation, 100)}%`,
                          }}
                          data-completion={
                            `${calculateReputationPercentage(profile.reputation, 30)}` === '100'
                              ? '100'
                              : ''
                          }
                        />
                      </div>
                      <span>{calculateReputationPercentage(profile.reputation, 100)}%</span>
                    </div>

                    <div className='progress-item'>
                      <span>Progress towards Mentor</span>
                      <div className='progress-bar'>
                        <div
                          className='progress-fill'
                          style={{
                            width: `${calculateReputationPercentage(profile.reputation, 500)}%`,
                          }}
                          data-completion={
                            `${calculateReputationPercentage(profile.reputation, 30)}` === '100'
                              ? '100'
                              : ''
                          }
                        />
                      </div>
                      <span>{calculateReputationPercentage(profile.reputation, 500)}%</span>
                    </div>

                    <div className='progress-item'>
                      <span>Progress towards Grandmaster</span>
                      <div className='progress-bar'>
                        <div
                          className='progress-fill'
                          style={{
                            width: `${calculateReputationPercentage(profile.reputation, 1000)}%`,
                          }}
                          data-completion={
                            `${calculateReputationPercentage(profile.reputation, 30)}` === '100'
                              ? '100'
                              : ''
                          }
                        />
                      </div>
                      <span>{calculateReputationPercentage(profile.reputation, 1000)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {!isEditing ? (
          <div className='questions-section'>
            <div className='profile-questionsasked-group'>
              <h2 className='profile-questionsasked'>Questions Asked</h2>
              <ul className='questions-list'>
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
              </ul>
            </div>

            <div className='profile-questionsanswered-group'>
              <h2 className='profile-questionsanswered'>Questions Answered</h2>
              <ul className='questions-list'>
                {userAnswers.length > 0 ? (
                  userAnswers.map((a, index) => (
                    <li key={index} className='question-item'>
                      <NavLink
                        to={`/question/${a._id}`}
                        id='answered_view'
                        className={({ isActive }) =>
                          `answered_button ${isActive ? 'answered' : ''}`
                        }>
                        {a.title}
                      </NavLink>
                    </li>
                  ))
                ) : (
                  <p className='no-answers'>No answers yet.</p>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
