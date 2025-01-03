import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Comment, Answer, Question, VoteData, Tag } from '../types';
import useUserContext from './useUserContext';
import { addComment } from '../services/commentService';
import { getQuestionById } from '../services/questionService';

/**
 * Custom hook for managing the answer page's state, navigation, and real-time updates.
 *
 * @returns questionID - The current question ID retrieved from the URL parameters.
 * @returns question - The current question object with its answers, comments, and votes.
 * @returns handleNewComment - Function to handle the submission of a new comment to a question or answer.
 * @returns handleNewAnswer - Function to navigate to the "New Answer" page
 */
const useAnswerPage = () => {
  const { qid } = useParams();
  const navigate = useNavigate();

  const { user, socket } = useUserContext();
  const [questionID, setQuestionID] = useState<string>(qid || '');
  const [question, setQuestion] = useState<Question | null>(null);

  /**
   * Function to handle navigation to the "New Answer" page.
   */
  const handleNewAnswer = () => {
    navigate(`/new/answer/${questionID}`);
  };

  useEffect(() => {
    if (!qid) {
      navigate('/home');
      return;
    }

    setQuestionID(qid);
  }, [qid, navigate]);

  /**
   * Function to handle the submission of a new comment to a question or answer.
   *
   * @param comment - The comment object to be added.
   * @param targetType - The type of target being commented on, either 'question' or 'answer'.
   * @param targetId - The ID of the target being commented on.
   */
  const handleNewComment = async (
    comment: Comment,
    targetType: 'question' | 'answer',
    targetId: string | undefined,
  ) => {
    try {
      if (targetId === undefined) {
        throw new Error('No target ID provided.');
      }
      const newComment = await addComment(targetId, targetType, comment);
      if (targetType === 'question') {
        setQuestion({
          ...(question as Question),
          comments: (question ? [...question.comments, newComment] : [newComment]).sort(
            (commentA, commentB) =>
              commentB.upVotes.length -
              commentB.downVotes.length -
              (commentA.upVotes.length - commentA.downVotes.length),
          ),
        });
      } else if (targetType === 'answer') {
        setQuestion({
          ...(question as Question),
          answers: question
            ? question.answers
                .map(a =>
                  a && a._id === targetId
                    ? {
                        ...a,
                        comments: [...a.comments, newComment].sort(
                          (commentA, commentB) =>
                            commentB.upVotes.length -
                            commentB.downVotes.length -
                            (commentA.upVotes.length - commentA.downVotes.length),
                        ),
                      }
                    : a,
                )
                .sort(
                  (answerA, answerB) =>
                    answerB.upVotes.length -
                    answerB.downVotes.length -
                    (answerA.upVotes.length - answerA.downVotes.length),
                )
            : [],
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error adding comment:', error);
    }
  };

  useEffect(() => {
    /**
     * Function to fetch the question data based on the question ID.
     */
    const fetchData = async () => {
      if (!user || !user.uid) {
        // eslint-disable-next-line no-console
        console.error('User is undefined');
        return;
      }

      try {
        const res = await getQuestionById(questionID, user.uid);
        setQuestion(res || null);
        setQuestion(prevQuestion =>
          prevQuestion
            ? // Updates answer with a comment with the matching object ID, and creates a new Question object
              {
                ...prevQuestion,
                answers: prevQuestion.answers
                  .map(a =>
                    a
                      ? {
                          ...a,
                          comments: a.comments.sort(
                            (commentA, commentB) =>
                              commentB.upVotes.length -
                              commentB.downVotes.length -
                              (commentA.upVotes.length - commentA.downVotes.length),
                          ),
                        }
                      : a,
                  )
                  .sort(
                    (answerA, answerB) =>
                      answerB.upVotes.length -
                      answerB.downVotes.length -
                      (answerA.upVotes.length - answerA.downVotes.length),
                  ),
                comments: prevQuestion.comments.sort(
                  (commentA, commentB) =>
                    commentB.upVotes.length -
                    commentB.downVotes.length -
                    (commentA.upVotes.length - commentA.downVotes.length),
                ),
              }
            : prevQuestion,
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching question:', error);
      }
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, [questionID, user, user.uid]);

  useEffect(() => {
    /**
     * Function to handle updates to the answers of a question.
     *
     * @param answer - The updated answer object.
     */
    const handleAnswerUpdate = ({ qid: id, answer }: { qid: string; answer: Answer }) => {
      if (id === questionID) {
        setQuestion(prevQuestion =>
          prevQuestion
            ? // Creates a new Question object with the new answer appended to the end
              { ...prevQuestion, answers: [...prevQuestion.answers, answer] }
            : prevQuestion,
        );
      }
    };

    /**
     * Function to handle updates to the comments of a question or answer.
     *
     * @param result - The updated question or answer object.
     * @param type - The type of the object being updated, either 'question' or 'answer'.
     */
    const handleCommentUpdate = ({
      result,
      type,
    }: {
      result: Question | Answer;
      type: 'question' | 'answer';
    }) => {
      if (type === 'question') {
        const questionResult = result as Question;

        if (questionResult._id === questionID) {
          setQuestion(questionResult);
        }
      } else if (type === 'answer') {
        setQuestion(prevQuestion =>
          prevQuestion
            ? // Updates answers with a matching object ID, and creates a new Question object
              {
                ...prevQuestion,
                answers: prevQuestion.answers.map(a =>
                  a._id === result._id ? (result as Answer) : a,
                ),
              }
            : prevQuestion,
        );
      }
    };

    /**
     * Function to handle updates to the views of a question.
     *
     * @param q The updated question object.
     */
    const handleViewsUpdate = (q: Question) => {
      if (q._id === questionID) {
        setQuestion(q);
      }
    };

    /**
     * Function to handle vote updates for a question.
     *
     * @param voteData - The updated vote data for a question
     */
    const handleVoteUpdate = (voteData: VoteData) => {
      if (voteData.type === 'Question') {
        if (voteData.id === questionID) {
          setQuestion(prevQuestion =>
            prevQuestion
              ? {
                  ...prevQuestion,
                  upVotes: [...voteData.upVotes],
                  downVotes: [...voteData.downVotes],
                }
              : prevQuestion,
          );
        }
      } else if (voteData.type === 'Answer') {
        setQuestion(prevQuestion =>
          prevQuestion
            ? // Updates answers with a matching object ID, and creates a new Question object
              {
                ...prevQuestion,
                answers: prevQuestion.answers
                  .map(a =>
                    a._id === voteData.id
                      ? {
                          ...a,
                          upVotes: [...voteData.upVotes],
                          downVotes: [...voteData.downVotes],
                        }
                      : a,
                  )
                  .sort(
                    (answerA, answerB) =>
                      answerB.upVotes.length -
                      answerB.downVotes.length -
                      (answerA.upVotes.length - answerA.downVotes.length),
                  ),
              }
            : prevQuestion,
        );
      } else if (voteData.type === 'Comment') {
        setQuestion(prevQuestion =>
          prevQuestion
            ? // Updates answer with a comment with the matching object ID, and creates a new Question object
              {
                ...prevQuestion,
                answers: prevQuestion.answers
                  .map(a =>
                    a
                      ? {
                          ...a,
                          comments: a.comments
                            .map(c =>
                              c._id === voteData.id
                                ? {
                                    ...c,
                                    upVotes: [...voteData.upVotes],
                                    downVotes: [...voteData.downVotes],
                                  }
                                : c,
                            )
                            .sort(
                              (commentA, commentB) =>
                                commentB.upVotes.length -
                                commentB.downVotes.length -
                                (commentA.upVotes.length - commentA.downVotes.length),
                            ),
                        }
                      : a,
                  )
                  .sort(
                    (answerA, answerB) =>
                      answerB.upVotes.length -
                      answerB.downVotes.length -
                      (answerA.upVotes.length - answerA.downVotes.length),
                  ),
                comments: prevQuestion.comments
                  .map(c =>
                    c._id === voteData.id
                      ? {
                          ...c,
                          upVotes: [...voteData.upVotes],
                          downVotes: [...voteData.downVotes],
                        }
                      : c,
                  )
                  .sort(
                    (commentA, commentB) =>
                      commentB.upVotes.length -
                      commentB.downVotes.length -
                      (commentA.upVotes.length - commentA.downVotes.length),
                  ),
              }
            : prevQuestion,
        );
      } else {
        throw new Error('Invalid type provided');
      }
    };

    /**
     * Function to handle updates to the subscribers of a question.
     *
     * @param result - The updated question object.
     */
    const handleSubscriberUpdate = ({
      result,
      type,
    }: {
      result: Question | Tag;
      type: 'question' | 'tag';
    }) => {
      if (type === 'question' && result._id === questionID) {
        setQuestion(result as Question);
      }
    };

    socket.on('answerUpdate', handleAnswerUpdate);
    socket.on('viewsUpdate', handleViewsUpdate);
    socket.on('commentUpdate', handleCommentUpdate);
    socket.on('voteUpdate', handleVoteUpdate);
    socket.on('subscriberUpdate', handleSubscriberUpdate);

    return () => {
      socket.off('answerUpdate', handleAnswerUpdate);
      socket.off('viewsUpdate', handleViewsUpdate);
      socket.off('commentUpdate', handleCommentUpdate);
      socket.off('voteUpdate', handleVoteUpdate);
      socket.off('subscriberUpdate', handleSubscriberUpdate);
    };
  }, [questionID, socket]);

  return {
    questionID,
    question,
    handleNewComment,
    handleNewAnswer,
  };
};

export default useAnswerPage;
