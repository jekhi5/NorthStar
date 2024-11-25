import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Cookies from 'js-cookie';
import { auth } from '../firebase';
import useLoginContext from './useLoginContext';
import { addUser, checkValidUser, getUserByUid } from '../services/userService';
import { User } from '../types';

/**
 * Custom hook to handle sign up input and submission.
 *
 * @returns formData, which contains:
 *  firstName - The current value of the first name input.
 *  lastName - The current value of the last name input.
 *  email - The current value of the email input.
 *  password - The current value of the password input (original and confirmation).
 *  username - The current value of the username input
 *
 * @returns handleInputChange - Function to handle changes in the input fields.
 * @returns handleSubmit - Function to handle login submission.
 * @returns error - An error message, if any.
 */
const useSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    passwordOriginal: '',
    passwordConfirmation: '',
  });
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  /**
   * Function to handle the input change event.
   *
   * @param e - the event object.
   */

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id.replace('Input', '')]: value }));
  };

  /**
   * Function to validate the form data.
   *
   * @returns true if the form is valid, false otherwise.
   */
  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.username ||
      !formData.passwordOriginal ||
      !formData.passwordConfirmation
    ) {
      setError('All fields are required');
      return false;
    }
    if (formData.passwordOriginal !== formData.passwordConfirmation) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.passwordOriginal.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  /**
   * Function to handle the form submission event.
   * Adds the user to Firebase and navigates to the home page on success.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      // Check if username and email is available
      const isUserValid = await checkValidUser(formData.username, formData.email);
      if (!isUserValid.available) {
        setError(isUserValid.message);
        return;
      }

      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.passwordOriginal,
      );
      const firebaseUser = userCredential.user;

      if (!firebaseUser) {
        throw new Error('Failed to create user in Firebase');
      }

      // Create user in our database
      const newUser: User = {
        uid: firebaseUser.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        status: 'Not endorsed',
        postNotifications: [],
        reputation: 0,
        emailsEnabled: false,
      };

      await addUser(newUser);
      const dbUser = await getUserByUid(newUser.uid);

      if (dbUser) {
        setUser(dbUser); // Set the user context
        Cookies.set('auth', firebaseUser.uid, { expires: 3 }); // Set the auth cookie to expire every 3 days
      } else {
        throw new Error('User not found in database');
      }

      navigate('/home');
    } catch (err) {
      if (err instanceof Error && err.message.includes('email-already-in-use')) {
        setError('Email is already in use (perhaps try logging in instead)');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  /**
   * Function to handle the Google sign-up event.
   * Authenticates the user with Google and navigates to the home page on success.
   *
   * @returns error - An error message, if any - else successfully signs up.
   */
  const handleGoogleSignUp = async () => {
    setError(null);
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user: firebaseUser } = result;

      if (!firebaseUser) {
        throw new Error('Failed to sign up with Google');
      }

      // Check if the user already exists in your database
      try {
        const existingUser = await getUserByUid(firebaseUser.uid);

        if (existingUser) {
          // User already exists, ask them to log in instead
          setError('User already exists - please log in!');
        }
        // If error is thrown, user doesn't exist
      } catch (err) {
        // User doesn't exist, create a new user in database
        const newUser: User = {
          uid: firebaseUser.uid,
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          username: `user_${firebaseUser.uid.slice(0, 8)}`,
          email: firebaseUser.email || '',
          status: 'Not endorsed',
          postNotifications: [],
          reputation: 0,
          emailsEnabled: false,
        };

        // Check if email is available (it should be, but better to be safe)
        const isUserValid = await checkValidUser(newUser.username, newUser.email);
        if (!isUserValid.available) {
          throw new Error(isUserValid.message);
        }

        await addUser(newUser);
        const dbUser = await getUserByUid(newUser.uid);

        if (dbUser) {
          setUser(dbUser);
          Cookies.set('auth', firebaseUser.uid, { expires: 3 });
        } else {
          throw new Error('User not found in database after creation');
        }

        navigate('/home');
      }
    } catch (err) {
      setError('Failed to sign up with Google. Please try again.');
    }
  };

  return {
    ...formData,
    handleInputChange,
    handleSubmit,
    handleGoogleSignUp,
    error,
  };
};

export default useSignUp;
