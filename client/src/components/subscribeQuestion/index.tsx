import './index.css';
import useSubscribeStatus from '../../hooks/useSubscribeStatus';
import toggleSubscribe from '../../services/subscriberService';
import { Question, Tag } from '../../types';
import useUserContext from '../../hooks/useUserContext';

/**
 * Interface represents the props for the VoteComponent.
 *
 * postObj - The question object containing voting information.
 */
interface SubscribeComponentProps {
  item: Question | Tag;
  type: 'question' | 'tag';
}

/**
 * A Vote component that allows users to upvote or downvote a question.
 *
 * @param item - The document object containing voting information.
 */
const SubscribeComponent = ({ item, type }: SubscribeComponentProps) => {
  const { user } = useUserContext();
  const { subscribed } = useSubscribeStatus({ item });

  /**
   * Function to handle subscribing to or unsubscribing to a question
   *
   */
  const handleToggleSubscribe = async () => {
    try {
      if (item._id) {
        await toggleSubscribe(item._id, type, user);
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className='subscribe-container'>
      <button
        className={`subscribe-button ${subscribed ? 'subscribe-button-subscribed' : ''}`}
        onClick={e => {
          e.preventDefault();
          handleToggleSubscribe();
        }}>
        {subscribed ? 'Unsubscribe' : 'Subscribe'}
      </button>
    </div>
  );
};

export default SubscribeComponent;
