import { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, updateProfile } from 'firebase/auth';
import { Question, User } from '../types';
import { getUserByUid, updateUser } from '../services/userService';
import {
  getQuestionsByAnsweredByUserId,
  getQuestionsByAskedByUserId,
} from '../services/questionService';
import useUserContext from './useUserContext';
import useLoginContext from './useLoginContext';

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
 * @returns handleProfilePictureUpload - Function to upload profile picture.
 */
const useProfilePage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [editedProfile, setEditedProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Question[]>([]);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [emailOpted, setEmailOpted] = useState<boolean | null>(null);
  const [optButtonText, setOptButtonText] = useState<string | null>(null);

  // Get user, and subsequently user id
  const { user: UserContext } = useUserContext();
  const { setUser } = useLoginContext();
  const uid = UserContext?.uid;
  const userId = UserContext?._id;
  const userCanEmail = UserContext?.emailsEnabled;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!uid) {
        setError('Uid not available.');
        return;
      }

      try {
        const profileData = await getUserByUid(uid);
        setProfile(profileData);
        const qlist = await getQuestionsByAskedByUserId(userId as string);
        setUserQuestions(qlist || []);
        const alist = await getQuestionsByAnsweredByUserId(userId as string);
        setUserAnswers(alist || []);

        setEmailOpted(userCanEmail as boolean);
        if (userCanEmail as boolean) {
          setOptButtonText('Disable Email Notifications');
        } else {
          setOptButtonText('Enable Email Notifications');
        }
        setEditedProfile(profileData); // Initialize editedProfile with fetched data
      } catch (err) {
        setError('Failed to load profile.');
      }
    };

    fetchProfile();
  }, [uid, userId, userCanEmail]);

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
      try {
        const updatedProfile = await updateUser(editedProfile);
        setUser(updatedProfile);
        setProfile(updatedProfile);
        setIsEditing(false); // Exit edit mode
        setUpdateError(null);
      } catch (err) {
        setUpdateError('Failed to update profile.');
      }
    }
  };

  const toggleEmailOptIn = async () => {
    const newEmailOpted = !(emailOpted as boolean);
    setEmailOpted(newEmailOpted);

    const updatedProfile = { ...(profile as User), emailsEnabled: newEmailOpted };
    setProfile(updatedProfile);

    await updateUser(updatedProfile);

    setOptButtonText(newEmailOpted ? 'Disable Email Notifications' : 'Enable Email Notifications');
  };

  // TODO THIS CURRENTLY DOES NOT WORK!!! NEED TO CHANGE THE WAY FILES ARE STORED IN FIREBASE
  // BUT I PROMISE IT WON'T MESS ANYTHING ELSE UP
  // Could also just change it back to using URLs for pictures which is what I had before
  const handleProfilePictureUpload = async (file: File) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const storage = getStorage();

    if (!user || !file) return;

    try {
      // Upload the file to Firebase Storage
      const storageRef = ref(storage, `profilePictures/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);

      // Get the download URL
      const photoURL = await getDownloadURL(storageRef);

      // Update the user's profile with the new photo URL
      await updateProfile(user, { photoURL });
    } catch (err) {
      // We log the errors here, but we do not throw an error as we do not want to block the
      // user from viewing the site just because the profile pic failed to load.
      if (err instanceof Error) {
        // eslint-disable-next-line no-console
        console.error('Error uploading profile picture:', err.message);
      } else {
        // eslint-disable-next-line no-console
        console.error('Error uploading profile picture:', err);
      }
    }
  };

  /**
   * Helper function to calculate the reputation percentage towards endorsed based on the user's reputation.
   * @param reputation the user's reputation
   * @param range the range of reputation required to be endorsed
   *
   * @returns the reputation percentage towards a given status, as a whole number
   */
  const calculateReputationPercentage = (reputation: number, range: number) => {
    if (reputation >= range) return 100;
    return ((reputation / range) * 100).toFixed(0);
  };

  return {
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
  };
};

export default useProfilePage;
