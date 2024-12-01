import { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL, StorageReference } from 'firebase/storage';
import { Question, User } from '../types';
import { checkValidUser, getUserByUsername, updateUser } from '../services/userService';
import {
  getQuestionsByAnsweredByUserId,
  getQuestionsByAskedByUserId,
} from '../services/questionService';
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
const useProfilePage = (username?: string) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [editedProfile, setEditedProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Question[]>([]);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [emailOpted, setEmailOpted] = useState<boolean | null>(null);
  const [optButtonText, setOptButtonText] = useState<string | null>(null);
  const [profilePicStorageRef, setProfilePicStorageRef] = useState<StorageReference | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicAdded, setProfilePicAdded] = useState<boolean>(false);

  const { setUser } = useLoginContext();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) {
        setError('Username not available.');
        return;
      }
      try {
        const profileData = await getUserByUsername(username);
        setProfile(profileData);
        const userId = profileData?._id;
        const userCanEmail = profileData?.emailsEnabled;
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
  }, [username]);

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
        // Check if username and email are available
        // Pass id since we can exclude user's current info from the check
        const isUserValid = await checkValidUser(
          editedProfile.username,
          editedProfile.email,
          editedProfile._id,
        );
        if (!isUserValid.available) {
          setUpdateError(isUserValid.message);
          return;
        }

        if (profilePicAdded && profilePicStorageRef && profilePicFile) {
          await uploadBytes(profilePicStorageRef, profilePicFile);

          // Get the download URL
          const photoURL = await getDownloadURL(profilePicStorageRef);

          setEditedProfile({ ...editedProfile, profilePicture: photoURL });
          setProfilePicAdded(false);
          setProfilePicStorageRef(null);
          setProfilePicFile(null);
        }

        const updatedProfile = await updateUser(editedProfile);
        setUser(updatedProfile);
        setProfile(updatedProfile);
        setIsEditing(false); // Exit edit mode
        setUpdateError(null);

        // Force reload with new username to load full profile
        if (username !== updatedProfile.username) {
          window.location.assign(`/profile/${updatedProfile.username}`);
        }
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

  /**
   * Handle uploading a profile picture for a user
   * @param file - The profile photo to upload
   */
  const handleProfilePictureUpload = async (file: File) => {
    if (!isEditing || !editedProfile || !file) return;

    const storage = getStorage();

    const acceptedFileTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/heif',
      'image/heic',
      'image/tiff',
    ];
    try {
      // Upload the file to Firebase Storage
      const storageRef = ref(storage, `profilePictures/${editedProfile.uid}/profilePicture`);
      if (!acceptedFileTypes.find(acceptedType => acceptedType === file.type)) {
        throw new Error(
          `File type not accepted${
            file.type.indexOf('/') > -1
              ? `: ${file.type.substring(file.type.indexOf('/') + 1)}`
              : ''
          }. Please use one of the following types: 
          ${acceptedFileTypes.map(type => type.substring(6)).join(', ')}`,
        );
      }
      setProfilePicStorageRef(storageRef);
      setProfilePicFile(file);
      setProfilePicAdded(true);
    } catch (err) {
      // We log the errors here, but we do not throw an error as we do not want to block the
      // user from viewing the site just because the profile pic failed to load.
      if (err instanceof Error) {
        setUpdateError(`Error uploading profile picture: ${err.message}`);
      } else {
        setUpdateError(`Error uploading profile picture`);
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
