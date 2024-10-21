import React from 'react';
import './index.css';
import AskQuestionButton from '../../askQuestionButton';

/**
 * Interface representing the props for the AnswerHeader component.
 *
 * - ansCount - The number of answers to display in the header.
 * - title - The title of the question or discussion thread.
 */
interface AnswerHeaderProps {
  ansCount: number;
  title: string;
}

/**
 * AnswerHeader component that displays a header section for the answer page.
 * It includes the number of answers, the title of the question, and a button to ask a new question.
 *
 * @param ansCount The number of answers to display.
 * @param title The title of the question or discussion thread.
 */
const AnswerHeader = ({ ansCount, title }: AnswerHeaderProps) => (
  <div id='answersHeader' className='space_between right_padding'>
    <div className='bold_title'>{ansCount} answers</div>
    <div className='bold_title answer_question_title'>{title}</div>
    <AskQuestionButton />
  </div>
);

export default AnswerHeader;
