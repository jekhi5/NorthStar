import './index.css';
import useSubscribeStatus from '../../hooks/useSubscribeStatus';
import toggleSubscribe from '../../services/subscriberService';
import { Question } from '../../types';
import useUserContext from '../../hooks/useUserContext';

/**
 * Interface represents the props for the VoteComponent.
 *
 * question - The question object containing voting information.
 */
interface SubscribeComponentProps {
  question: Question;
}

/**
 * A Vote component that allows users to upvote or downvote a question.
 *
 * @param question - The question object containing voting information.
 */
const SubscribeComponent = ({ question }: SubscribeComponentProps) => {
  const { user } = useUserContext();
  const { subscribed } = useSubscribeStatus({ question });

  /**
   * Function to handle subscribing to or unsubscribing to a question
   *
   */
  const handleToggleSubscribe = async () => {
    try {
      if (question._id) {
        await toggleSubscribe(question._id, user);
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className='subscribe-container'>
      <button
        className={`subscribe-button ${subscribed ? 'subscribe-button-subscribed' : ''}`}
        onClick={handleToggleSubscribe}>
        {subscribed ? 'Unsubscribe' : 'Subscribe'}
      </button>
    </div>
  );
};

export default SubscribeComponent;
