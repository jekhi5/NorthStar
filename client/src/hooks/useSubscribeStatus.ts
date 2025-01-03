import { useEffect, useState } from 'react';
import { Question, Tag } from '../types';
import useUserContext from './useUserContext';

/**
 * Custom hook to handle subscription logic for a question.
 * It manages the current user subscription status (subscribed, unsubscribed),
 * and handles real-time subscription updates via socket events.
 *
 * @param question - The question object for which the subscription is tracked.
 *
 * @returns subscribed - The user's subscription status
 * @returns setSubscription - The function to manually update user's subscription status
 */

const useSubscribeStatus = ({ item }: { item: Question | Tag }) => {
  const { user, socket } = useUserContext();
  const [subscribed, setSubscribed] = useState<boolean>(false);

  useEffect(() => {
    /**
     * Function to get the current subscription value for the user.
     *
     * @returns The current subscription value for the user in the question, true for subscribe, false for unsubscribed.
     */
    const getSubscriptionValue = () =>
      user && item?.subscribers?.find(sub => sub._id === user._id) !== undefined;

    setSubscribed(() => getSubscriptionValue());
  }, [item, socket, user]);

  return {
    subscribed,
    setSubscribed,
  };
};

export default useSubscribeStatus;
