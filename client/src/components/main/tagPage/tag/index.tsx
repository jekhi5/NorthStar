import React from 'react';
import './index.css';
import { TagData } from '../../../../types';
import useTagSelected from '../../../../hooks/useTagSelected';

/**
 * Props for the Tag component.
 *
 * t - The tag object.
 * clickTag - Function to handle the tag click event.
 */
interface TagProps {
  t: TagData;
  clickTag: (tagName: string) => void;
}

/**
 * Tag component that displays information about a specific tag.
 * The component displays the tag's name, description, and the number of associated questions.
 * It also triggers a click event to handle tag selection.
 *
 * @param t - The tag object .
 * @param clickTag - Function to handle tag clicks.
 */
const TagView = ({ t, clickTag }: TagProps) => {
  const { tag } = useTagSelected(t);

  return (
    <div
      className='tagNode'
      onClick={() => {
        clickTag(t.name);
      }}>
      <div className='tagName'>{tag.name}</div>
      <div className='tagDescription'>{tag.description}</div>
      <div>{t.qcnt} questions</div>
    </div>
  );
};

export default TagView;
