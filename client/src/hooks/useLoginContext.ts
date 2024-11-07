import { useContext } from 'react';
import LoginContext, { LoginContextType } from '../contexts/LoginContext';

/**
 * Custom hook to access the LoginContext.
 *
 * @throws It will throw an error if the `LoginContext` is null.
 *
 * @returns context - the context value for managing login state, including the `setUser` function.
 */
const useLoginContext = (): LoginContextType => {
  const context = useContext(LoginContext);

  if (context === null) {
    throw new Error('Login context is null.');
  }

  return context;
};

export default useLoginContext;
