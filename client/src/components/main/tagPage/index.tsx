import React from 'react';
import './index.css';
import TagView from './tag';
import useTagPage from '../../../hooks/useTagPage';
import AskQuestionButton from '../askQuestionButton';

/**
 * Represents the TagPage component which displays a list of tags
 * and provides functionality to handle tag clicks and ask a new question.
 */
const TagPage = () => {
  const { tlist, clickTag } = useTagPage();

  return (
    <>
      <div className='space_between right_padding'>
        <div className='bold_title'>{tlist.length} Tags</div>
        <div className='bold_title'>All Tags</div>
        <AskQuestionButton />
      </div>
      <div className='tag_list right_padding'>
        {tlist.map((t, idx) => (
          <TagView key={idx} t={t} clickTag={clickTag} />
        ))}
      </div>
    </>
  );
};

export default TagPage;
