import { getMetaData } from '../../../tool';
import AnswerView from './answer';
import AnswerHeader from './header';
import { Comment } from '../../../types';
import './index.css';
import QuestionBody from './questionBody';
import VoteComponent from '../voteComponent';
import CommentSection from '../commentSection';
import useAnswerPage from '../../../hooks/useAnswerPage';
import SubscribeComponent from '../../subscribeQuestion';

/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 */
const AnswerPage = () => {
  const { questionID, question, handleNewComment, handleNewAnswer } = useAnswerPage();

  if (!question) {
    return null;
  }

  return (
    <div className='answer-page'>
      <AnswerHeader question={question} ansCount={question.answers.length} title={question.title} />
      <div className='answer-button-container'>
        <SubscribeComponent item={question} type={'question'} />
        <button
          className='ansButton'
          onClick={() => {
            handleNewAnswer();
          }}>
          Answer Probe
        </button>
      </div>
      <QuestionBody
        views={question.views.length}
        text={question.text}
        askby={question.askedBy}
        meta={getMetaData(new Date(question.askDateTime))}
      />
      <CommentSection
        comments={question.comments}
        handleAddComment={(comment: Comment) => handleNewComment(comment, 'question', questionID)}
      />
      {question.answers.map((a, idx) => (
        <>
          <AnswerView
            answer={a}
            key={idx}
            text={a.text}
            ansBy={a.ansBy}
            meta={getMetaData(new Date(a.ansDateTime))}
            comments={a.comments}
            handleAddComment={(comment: Comment) => handleNewComment(comment, 'answer', a._id)}
          />
        </>
      ))}
    </div>
  );
};

export default AnswerPage;
