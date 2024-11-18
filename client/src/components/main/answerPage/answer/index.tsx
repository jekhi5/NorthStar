import { handleHyperlink } from '../../../../tool';
import CommentSection from '../../commentSection';
import './index.css';
import { Comment, User } from '../../../../types';

/**
 * Interface representing the props for the AnswerView component.
 *
 * - text The content of the answer.
 * - ansBy The the user who wrote the answer.
 * - meta Additional metadata related to the answer.
 * - comments An array of comments associated with the answer.
 * - handleAddComment Callback function to handle adding a new comment.
 */
interface AnswerProps {
  text: string;
  ansBy: User;
  meta: string;
  comments: Comment[];
  handleAddComment: (comment: Comment) => void;
}

/**
 * AnswerView component that displays the content of an answer with the author's name and metadata.
 * The answer text is processed to handle hyperlinks, and a comment section is included.
 *
 * @param text The content of the answer.
 * @param ansBy The user that authored the answer.
 * @param meta Additional metadata related to the answer.
 * @param comments An array of comments associated with the answer.
 * @param handleAddComment Function to handle adding a new comment.
 */
const AnswerView = ({ text, ansBy, meta, comments, handleAddComment }: AnswerProps) => (
  <div className='answer right_padding'>
    <div id='answerText' className='answerText'>
      {handleHyperlink(text)}
    </div>
    <div className='answerAuthor'>
      <div className='answer_author'>{ansBy.username}</div>
      <div className='question_author_status'>
        {ansBy.status !== 'Not endorsed' ? ansBy.status : ''}
      </div>
      <div className='answer_question_meta'>{meta}</div>
    </div>
    <CommentSection comments={comments} handleAddComment={handleAddComment} />
  </div>
);

export default AnswerView;
