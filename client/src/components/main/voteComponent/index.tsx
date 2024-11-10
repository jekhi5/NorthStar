import { downvoteQuestion, upvoteQuestion } from '../../../services/questionService';
import './index.css';
import useUserContext from '../../../hooks/useUserContext';
import { Answer, Comment, Question } from '../../../types';
import useVoteStatus from '../../../hooks/useVoteStatus';
import { downvoteAnswer, upvoteAnswer } from '../../../services/answerService';
import { downvoteComment, upvoteComment } from '../../../services/commentService';

/**
 * Interface represents the props for the VoteComponent.
 *
 * question - The question object containing voting information.
 */
interface VoteComponentProps {
  post: Question | Answer | Comment;
  postType: 'Question' | 'Answer' | 'Comment';
}

/**
 * A Vote component that allows users to upvote or downvote a question.
 *
 * @param question - The question object containing voting information.
 */
const VoteComponent = ({ post, postType }: VoteComponentProps) => {
  const { user } = useUserContext();
  const { count, voted } = useVoteStatus({ post, postType });

  /**
   * Function to handle upvoting or downvoting a question.
   *
   * @param type - The type of vote, either 'upvote' or 'downvote'.
   */
  const handleVote = async (type: string) => {
    try {
      if (post._id) {
        if (postType === 'Question') {
          if (type === 'upvote') {
            await upvoteQuestion((post as Question)._id as string, user.uid);
          } else if (type === 'downvote') {
            await downvoteQuestion((post as Question)._id as string, user.uid);
          }
        } else if (postType === 'Answer') {
          if (type === 'upvote') {
            await upvoteAnswer((post as Answer)._id as string, user.uid);
          } else if (type === 'downvote') {
            await downvoteAnswer((post as Answer)._id as string, user.uid);
          }
        } else if (postType === 'Comment') {
          if (type === 'upvote') {
            await upvoteComment((post as Comment)._id as string, user.uid);
          } else if (type === 'downvote') {
            await downvoteComment((post as Comment)._id as string, user.uid);
          }
        } else {
          throw new Error('Invalid Post Type');
        }
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className='vote-container'>
      <button
        className={`vote-button ${voted === 1 ? 'vote-button-upvoted' : ''}`}
        onClick={() => handleVote('upvote')}>
        Upvote
      </button>
      <button
        className={`vote-button ${voted === -1 ? 'vote-button-downvoted' : ''}`}
        onClick={() => handleVote('downvote')}>
        Downvote
      </button>
      <span className='vote-count'>{count}</span>
    </div>
  );
};

export default VoteComponent;
