import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Answer, OrderType, Question, User } from '../types';
import { getQuestionsByFilter } from '../services/questionService';
import toggleSubscribe from '../services/subscriberService';

/**
 * Custom hook for managing the question page state, filtering, and real-time updates.
 *
 * @returns titleText - The current title of the question page
 * @returns qlist - The list of questions to display
 * @returns setQuestionOrder - Function to set the sorting order of questions (e.g., newest, oldest).
 */
const useQuestionPage = () => {
  const { socket } = useUserContext();
  const { qid: qidParam } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [titleText, setTitleText] = useState<string>('All Questions');
  const [search, setSearch] = useState<string>('');
  const [questionOrder, setQuestionOrder] = useState<OrderType>('newest');
  const [qlist, setQlist] = useState<Question[]>([]);
  const [questionID, setQuestionID] = useState<string>(qidParam || '');
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (!qidParam) {
      navigate('/home');
      return;
    }

    setQuestionID(qidParam);
  }, [qidParam, navigate]);

  useEffect(() => {
    let pageTitle = 'All Questions';
    let searchString = '';

    const searchQuery = searchParams.get('search');
    const tagQuery = searchParams.get('tag');

    if (searchQuery) {
      pageTitle = 'Search Results';
      searchString = searchQuery;
    } else if (tagQuery) {
      pageTitle = tagQuery;
      searchString = `[${tagQuery}]`;
    }

    setTitleText(pageTitle);
    setSearch(searchString);
  }, [searchParams]);

  /**
   * Function to handle the toggling of a user as a subscriber to a question.
   *
   * @param user - The user object to be added.
   * @param id - The ID of the question being subscribed to.
   */
  const handleToggleSubscriber = async (user: User, id: string | undefined) => {
    try {
      if (id === undefined) {
        throw new Error('No ID provided.');
      }

      await toggleSubscribe(id, user);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error toggling subscriber:', error);
    }
  };

  useEffect(() => {
    /**
     * Function to fetch questions based on the filter and update the question list.
     */
    const fetchData = async () => {
      try {
        const res = await getQuestionsByFilter(questionOrder, search);
        setQlist(res || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    /**
     * Function to handle question updates from the socket.
     *
     * @param questionObject - the updated question object.
     */
    const handleQuestionUpdate = (questionObject: Question) => {
      setQlist(prevQlist => {
        const questionExists = prevQlist.some(q => q._id === questionObject._id);

        if (questionExists) {
          // Update the existing question
          return prevQlist.map(q => (q._id === questionObject._id ? questionObject : q));
        }

        return [questionObject, ...prevQlist];
      });
    };

    /**
     * Function to handle answer updates from the socket.
     *
     * @param qid - The question ID.
     * @param answer - The answer object.
     */
    const handleAnswerUpdate = ({ qid, answer }: { qid: string; answer: Answer }) => {
      setQlist(prevQlist =>
        prevQlist.map(q => (q._id === qid ? { ...q, answers: [...q.answers, answer] } : q)),
      );
    };

    /**
     * Function to handle views updates from the socket.
     *
     * @param questionObj - The updated question object.
     */
    const handleViewsUpdate = (questionObj: Question) => {
      setQlist(prevQlist => prevQlist.map(q => (q._id === questionObj._id ? questionObj : q)));
    };

    /**
     * Function to handle updates to the subscribers of a question.
     *
     * @param result - The updated question object.
     */
    const handleSubscriberUpdate = ({ result }: { result: Question }) => {
      const questionResult = result as Question;

      if (questionResult._id === questionID) {
        setQuestion(questionResult);
      }
    };

    fetchData();

    socket.on('questionUpdate', handleQuestionUpdate);
    socket.on('answerUpdate', handleAnswerUpdate);
    socket.on('viewsUpdate', handleViewsUpdate);
    socket.on('subscriberUpdate', handleSubscriberUpdate);

    return () => {
      socket.off('questionUpdate', handleQuestionUpdate);
      socket.off('answerUpdate', handleAnswerUpdate);
      socket.off('viewsUpdate', handleViewsUpdate);
      socket.off('subscriberUpdate', handleSubscriberUpdate);
    };
  }, [questionID, questionOrder, search, socket]);

  return { titleText, qlist, setQuestionOrder, handleToggleSubscriber, question, questionID };
};

export default useQuestionPage;
