import { useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { getUserByUid, updateUser } from '../services/userService';
import UserContext from '../contexts/UserContext';

/**
 * Custom hook to manage the state and logic for the profile page and profile page updates.
 *
 * @returns profile - The user's profile data.
 * @returns editedProfile - The profile data being edited.
 * @returns error - An error message if fetching the profile data fails.
 * @returns updateError - An error message if saving the profile data fails.
 * @returns isEditing - Boolean indicating if the profile is in edit mode.
 * @returns toggleEditing - Function to toggle edit mode.
 * @returns handleChange - Function to handle field changes.
 * @returns saveProfile - Function to save edited profile.
 */
const useProfilePage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [editedProfile, setEditedProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Get user, and subsequently user id
  const context = useContext(UserContext);
  const uid = context?.user?.uid;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!uid) {
        setError('Uid not available.');
        return;
      }

      try {
        const profileData = await getUserByUid(uid);
        setProfile(profileData);
        setEditedProfile(profileData); // Initialize editedProfile with fetched data
      } catch (err) {
        setError('Failed to load profile.');
      }
    };

    fetchProfile();
  }, [uid]);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    if (!isEditing && profile) {
      // Make sure editedProfile is set to the current profile data when entering edit mode
      setEditedProfile(profile);
    }
  };

  const handleChange = (field: keyof User, value: string) => {
    setEditedProfile(prev => (prev ? { ...prev, [field]: value } : null));
  };

  const saveProfile = async () => {
    if (editedProfile) {
      console.log('Edited profile:', editedProfile);
      try {
        const updatedProfile = await updateUser(editedProfile);
        setProfile(updatedProfile);
        setIsEditing(false); // Exit edit mode
        setUpdateError(null);
      } catch (err) {
        console.error('Profile update error:', err);
        setUpdateError('Failed to update profile.');
      }
    }
  };

  return {
    profile,
    editedProfile,
    error,
    updateError,
    isEditing,
    toggleEditing,
    handleChange,
    saveProfile,
  };
};

export default useProfilePage;
