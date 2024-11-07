import useProfilePage from '../../../hooks/useProfilePage';

/**
 * ProfilePage component that displays a user's personal information.
 */
const ProfilePage = () => {
  const { profile, error } = useProfilePage();

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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
