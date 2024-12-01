import './index.css';
import { Question } from '../../../../types';
import VoteComponent from '../../voteComponent';

/**
 * Interface representing the props for the AnswerHeader component.
 *
 * - ansCount - The number of answers to display in the header.
 * - title - The title of the question or discussion thread.
 */
interface AnswerHeaderProps {
  question: Question;
  ansCount: number;
  title: string;
}

/**
 * AnswerHeader component that displays a header section for the answer page.
 * It includes the number of answers, the title of the question, and a button to ask a new question.
 *
 * @param question The question being displayed on this page.
 * @param ansCount The number of answers to display.
 * @param title The title of the question or discussion thread.
 */
const AnswerHeader = ({ question, ansCount, title }: AnswerHeaderProps) => (
  <div id='answersHeader' className='space_between right_padding'>
    <div className='header-left'>
      <div className='answer-question-title'>{title}</div>
      <div className='answer-count'>{ansCount} answers</div>
    </div>
    <div className='header-right'>
      <VoteComponent post={question} postType='Question' />
    </div>
  </div>
);

export default AnswerHeader;
