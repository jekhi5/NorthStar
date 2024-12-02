import { NavLink } from 'react-router-dom';
import './index.css';
import { handleHyperlink } from '../../../../tool';
import { User } from '../../../../types';
import defaultProfilePic from '../../../../images/default-profile-pic.png';

/**
 * Interface representing the props for the QuestionBody component.
 *
 * - views - The number of views the question has received.
 * - text - The content of the question, which may contain hyperlinks.
 * - askby - The user who asked the question.
 * - meta - Additional metadata related to the question, such as the date and time it was asked.
 */
interface QuestionBodyProps {
  text: string;
  askby: User;
  meta: string;
}

/**
 * QuestionBody component that displays the body of a question.
 * It includes the question content (with hyperlink handling),
 * the username of the author, and additional metadata.
 *
 * @param text The content of the question.
 * @param askby The User of the question's author.
 * @param meta Additional metadata related to the question.
 */
const QuestionBody = ({ text, askby, meta }: QuestionBodyProps) => (
  <div id='questionBody' className='questionBody right_padding'>
    <div className='answer_question_text'>{handleHyperlink(text)}</div>
    <div className='answer_question_right'>
      <div className='user-avatar'>
        <img
          src={askby.profilePicture ?? defaultProfilePic}
          alt='User avatar'
          className='avatar-image'
        />
      </div>
      <NavLink to={`/profile/${askby.username}`} className='question_author'>
        {askby.username}
      </NavLink>
      <div className='question_author_status'>
        {askby.status !== 'Not endorsed' ? askby.status : ''}
      </div>
      <div className='answer_question_meta q-only-meta'>asked {meta}</div>
    </div>
  </div>
);

export default QuestionBody;
