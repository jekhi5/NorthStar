import { useEffect, useState } from 'react';
import { Answer, Question, Comment } from '../types';
import useUserContext from './useUserContext';

/**
 * Custom hook to handle voting logic for a question.
 * It manages the current vote count, user vote status (upvoted, downvoted),
 * and handles real-time vote updates via socket events.
 *
 * @param post - The question/answer/comment object for which the voting is tracked.
 * @param postType - the type of the post for which the voting is tracked.
 *
 * @returns count - The urrent vote count (upVotes - downVotes)
 * @returns setCount - The function to manually update vote count
 * @returns voted - The user's vote status
 * @returns setVoted - The function to manually update user's vote status
 */

const useVoteStatus = ({ post }: { post: Question | Answer | Comment }) => {
  const { user, socket } = useUserContext();
  const [count, setCount] = useState<number>(0);
  const [voted, setVoted] = useState<number>(0);

  useEffect(() => {
    /**
     * Function to get the current vote value for the user.
     *
     * @returns The current vote value for the user in the question, 1 for upvote, -1 for downvote, 0 for no vote.
     */
    const getVoteValue = () => {
      if (user.uid && post?.upVotes?.includes(user.uid)) {
        return 1;
      }
      if (user.uid && post?.downVotes?.includes(user.uid)) {
        return -1;
      }
      return 0;
    };

    // Set the initial count and vote value
    setCount((post.upVotes || []).length - (post.downVotes || []).length);
    setVoted(getVoteValue());
  }, [post, user.uid, socket]);

  return {
    count,
    setCount,
    voted,
    setVoted,
  };
};

export default useVoteStatus;
