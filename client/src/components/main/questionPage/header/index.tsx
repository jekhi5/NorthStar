import './index.css';
import { ChangeEventHandler, KeyboardEventHandler } from 'react';
import OrderButton from './orderButton';
import { OrderType, orderTypeDisplayName } from '../../../../types';
import AskQuestionButton from '../../askQuestionButton';

/**
 * Interface representing the props for the QuestionHeader component.
 *
 * titleText - The title text displayed at the top of the header.
 * qcnt - The number of questions to be displayed in the header.
 * setQuestionOrder - A function that sets the order of questions based on the selected message.
 */
interface QuestionHeaderProps {
  val: string;
  handleInputChange: ChangeEventHandler<HTMLInputElement>;
  handleKeyDown: KeyboardEventHandler<HTMLInputElement>;
  titleText: string;
  qcnt: number;
  setQuestionOrder: (order: OrderType) => void;
}

/**
 * QuestionHeader component displays the header section for a list of questions.
 * It includes the title, a button to ask a new question, the number of the quesions,
 * and buttons to set the order of questions.
 *
 * @param titleText - The title text to display in the header.
 * @param qcnt - The number of questions displayed in the header.
 * @param setQuestionOrder - Function to set the order of questions based on input message.
 */
const QuestionHeader = ({
  val,
  handleInputChange,
  handleKeyDown,
  titleText,
  qcnt,
  setQuestionOrder,
}: QuestionHeaderProps) => (
  <div className='question-header'>
    <div className='header-top'>
      <h1 className='q-header-title'>{titleText}</h1>
      <div className='search-and-ask-q'>
        <input
          id='searchBar'
          placeholder='Search...'
          type='text'
          value={val}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <AskQuestionButton />
      </div>
    </div>
    <div className='header-bottom'>
      <div className='question-count'>{qcnt === 1 ? '1 probe' : `${qcnt || 0} probes`}</div>
      <div className='order-buttons'>
        {Object.keys(orderTypeDisplayName).map((order, idx) => (
          <OrderButton
            key={idx}
            orderType={order as OrderType}
            setQuestionOrder={setQuestionOrder}
          />
        ))}
      </div>
    </div>
  </div>
);

export default QuestionHeader;
