import { useContext } from 'react';
import UserContext, { UserContextType } from '../contexts/UserContext';

/**
 * Custom hook to access the current user context.
 *
 * @returns context - Returns the user context object, which contains user and socket information.
 *
 * @throws it will throw an error if the context is not found or is null.
 */
const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error('User context is null.');
  }

  return context;
};

export default useUserContext;
