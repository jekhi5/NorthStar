import useProfilePage from '../../../hooks/useProfilePage';

/**
 * ProfilePage component that displays a user's personal information.
 */
const ProfilePage = () => {
  const { profile, error, calculateReputationPercentage } = useProfilePage();

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
          <div className='profile-status'>
            <ul>
              <li>
                Progress towards Endorsed: {calculateReputationPercentage(profile.reputation, 30)}%
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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
