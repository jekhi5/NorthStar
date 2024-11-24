import { useNavigate } from 'react-router-dom';
import './index.css';
import { getMetaData } from '../../../../tool';
import { Question } from '../../../../types';
import defaultProfilePic from '../../../../images/default-profile-pic.png';

/**
 * Interface representing the props for the Question component.
 *
 * q - The question object containing details about the question.
 */
interface QuestionProps {
  q: Question;
}

/**
 * Question component renders the details of a question including its title, tags, author, answers, and views.
 * Clicking on the component triggers the handleAnswer function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param q - The question object containing question details.
 */
const QuestionView = ({ q }: QuestionProps) => {
  const navigate = useNavigate();

  /**
   * Function to navigate to the home page with the specified tag as a search parameter.
   *
   * @param tagName - The name of the tag to be added to the search parameters.
   */
  const clickTag = (tagName: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tag', tagName);

    navigate(`/home?${searchParams.toString()}`);
  };

  /**
   * Function to navigate to the specified question page based on the question ID.
   *
   * @param questionID - The ID of the question to navigate to.
   */
  const handleAnswer = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  const profilePic =
    q.askedBy?.profilePicture === '' ? defaultProfilePic : q.askedBy?.profilePicture;

  return (
    <div
      className='question right_padding'
      onClick={() => {
        if (q._id) {
          handleAnswer(q._id);
        }
      }}>
      <div className='postStats'>
        <div>{q.answers.length || 0} answers</div>
        <div>{q.views.length} views</div>
      </div>
      <div className='question_mid'>
        <div className='postTitle'>{q.title}</div>
        <div className='question_tags'>
          {q.tags.map((tag, idx) => (
            <button
              key={idx}
              className='question_tag_button'
              onClick={e => {
                e.stopPropagation();
                clickTag(tag.name);
              }}>
              {tag.name}
            </button>
          ))}
        </div>
      </div>
      <div className='lastActivity'>
        <div className='user-info'>
          <div className='user-avatar'>
            <img src={profilePic ?? defaultProfilePic} alt='User avatar' className='avatar-image' />
          </div>
          <div className='user-details'>
            <div className='question_author'>{q.askedBy?.username || 'Unknown Author'}</div>
            <div
              className={`question_author_status status-${q.askedBy.status.toLowerCase().replace(' ', '-')}`}>
              {q.askedBy.status !== 'Not endorsed' ? q.askedBy.status : ''}
            </div>
          </div>
          <div>&nbsp;</div>
          <div className='question_meta'>asked {getMetaData(new Date(q.askDateTime))}</div>
        </div>
      </div>
    </div>
  );
};

export default QuestionView;
