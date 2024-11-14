import useProfilePage from '../../../hooks/useProfilePage';
import './index.css';

const ProfilePage = () => {
  const {
    profile,
    editedProfile,
    error,
    updateError,
    isEditing,
    toggleEditing,
    handleChange,
    saveProfile,
    handleProfilePictureUpload,
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
            <p className='profile-status'>Status: {profile.status}</p>
            <button onClick={toggleEditing}>Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
