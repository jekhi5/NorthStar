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

const useVoteStatus = ({
  post,
  postType,
}: {
  post: Question | Answer | Comment;
  postType: 'Question' | 'Answer' | 'Comment';
}) => {
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
      if (postType === 'Question') {
        if (user.uid && (post as Question)?.upVotes?.includes(user.uid)) {
          return 1;
        }
        if (user.uid && (post as Question)?.downVotes?.includes(user.uid)) {
          return -1;
        }
      } else if (postType === 'Answer') {
        if (user.uid && (post as Answer)?.upVotes?.includes(user.uid)) {
          return 1;
        }
        if (user.uid && (post as Answer)?.downVotes?.includes(user.uid)) {
          return -1;
        }
      } else if (postType === 'Comment') {
        if (user.uid && (post as Comment)?.upVotes?.includes(user.uid)) {
          return 1;
        }
        if (user.uid && (post as Comment)?.downVotes?.includes(user.uid)) {
          return -1;
        }
      }
      return 0;
    };

    // Set the initial count and vote value
    if (postType === 'Question') {
      setCount(
        ((post as Question).upVotes || []).length - ((post as Question).downVotes || []).length,
      );
      setVoted(getVoteValue());
    } else if (postType === 'Answer') {
      setCount(((post as Answer).upVotes || []).length - ((post as Answer).downVotes || []).length);
      setVoted(getVoteValue());
    } else if (postType === 'Comment') {
      setCount(
        ((post as Comment).upVotes || []).length - ((post as Comment).downVotes || []).length,
      );
      setVoted(getVoteValue());
    }
  }, [post, postType, user.uid, socket]);

  return {
    count,
    setCount,
    voted,
    setVoted,
  };
};

export default useVoteStatus;
