import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Answer, OrderType, Question } from '../types';
import { getQuestionsByFilter } from '../services/questionService';

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

  useEffect(() => {
    if (!qidParam) {
      navigate(`/home${window.location.search}`);
      return;
    }

    setQuestionID(qidParam);
  }, [qidParam, navigate]);

  useEffect(() => {
    let pageTitle = 'All Probes';
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

    fetchData();

    socket.on('questionUpdate', handleQuestionUpdate);
    socket.on('answerUpdate', handleAnswerUpdate);
    socket.on('viewsUpdate', handleViewsUpdate);

    return () => {
      socket.off('questionUpdate', handleQuestionUpdate);
      socket.off('answerUpdate', handleAnswerUpdate);
      socket.off('viewsUpdate', handleViewsUpdate);
    };
  }, [questionID, questionOrder, search, socket]);

  return { titleText, qlist, setQuestionOrder };
};

export default useQuestionPage;
