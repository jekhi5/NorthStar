import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
  };
};

export default useLogin;
