import { createContext } from 'react';
import { User } from '../types';

/**
 * Interface representing the context type for user login management.
 *
 * - setUser - A function to update the current user in the context,
 *             which take User object representing the logged-in user or null
 *             to indicate no user is logged in.
 */
export interface LoginContextType {
  setUser: (user: User | null) => void;
}

const LoginContext = createContext<LoginContextType | null>(null);

export default LoginContext;
