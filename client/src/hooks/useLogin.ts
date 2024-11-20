import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState, useEffect, useCallback } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Cookies from 'js-cookie';
import { auth } from '../firebase'; // Firebase initialization
import useLoginContext from './useLoginContext';
import { getUserByUid } from '../services/userService';

/**
 * Custom hook to handle login input and submission.
 *
 * @returns email - The current value of the email input.
 * @returns password - The current value of the password input.
 * @returns handleInputChange - Function to handle changes in the input fields.
 * @returns handleSubmit - Function to handle login submission.
 * @returns error - An error message, if any.
 */
const useLogin = () => {
  const [email, setEmail] = useState<string>(''); // Ensure it's initialized as an empty string
  const [password, setPassword] = useState<string>(''); // Same for password
  const [error, setError] = useState<string | null>(null); // Error state can remain string | null
  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  /**
   * Function to attempt auto login with the provided UID.
   */
  const autoLogin = useCallback(
    async (uid: string) => {
      try {
        const dbUser = await getUserByUid(uid);
        if (dbUser) {
          setUser(dbUser);
          navigate('/home');
        } else {
          // If user not found, clear the cookie
          Cookies.remove('auth');
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Auto login failed:', err);
        Cookies.remove('auth');
      }
    },
    [navigate, setUser],
  );

  useEffect(() => {
    // Check for existing auth cookie
    const cookie = Cookies.get('auth');
    // If cookie exists, attempt auto login
    if (cookie) autoLogin(cookie);
  }, [autoLogin]);

  /**
   * Function to handle the input change event.
   *
   * @param e - the event object.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'emailInput') {
      setEmail(value);
    } else if (id === 'passwordInput') {
      setPassword(value);
    }
  };

  /**
   * Function to handle the form submission event.
   * Authenticates the user with Firebase and navigates to the home page on success.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Reset the error before attempting login

    try {
      // Firebase authentication with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Check if user exists in database
      const dbUser = await getUserByUid(user.uid);

      if (dbUser) {
        setUser(dbUser); // Set the user context
        Cookies.set('auth', user.uid, { expires: 3 }); // Set the auth cookie to expire every 3 days
      } else {
        throw new Error('User not found in database');
      }

      navigate('/home');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return {
    email,
    password,
    handleInputChange,
    handleSubmit,
    error,
    autoLogin,
  };
};

export default useLogin;
