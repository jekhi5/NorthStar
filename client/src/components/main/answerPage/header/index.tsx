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
  views: number;
  ansCount: number;
  title: string;
}

/**
 * AnswerHeader component that displays a header section for the answer page.
 * It includes the number of answers, the title of the question, and a button to ask a new question.
 *
 * @param question The question being displayed on this page.
 * @param views The number of views the question has received.
 * @param ansCount The number of answers to display.
 * @param title The title of the question or discussion thread.
 */
const AnswerHeader = ({ question, views, ansCount, title }: AnswerHeaderProps) => (
  <div id='answersHeader' className='space_between'>
    <div className='header-left'>
      <div className='answer-question-title'>{title}</div>
      <div className='answer-stats'>
        {`${views === 1 ? '1 view' : `${views || 0} views`}  & ${ansCount === 1 ? '1 answer' : `${ansCount || 0} answers`}`}
      </div>
    </div>
    <div className='header-right'>
      <VoteComponent post={question} postType='Question' />
    </div>
  </div>
);

export default AnswerHeader;
