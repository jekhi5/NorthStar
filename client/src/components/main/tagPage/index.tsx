import './index.css';
import TagView from './tag';
import useTagPage from '../../../hooks/useTagPage';

const TagPage = () => {
  const { tlist, clickTag } = useTagPage();

  return (
    <div className='tag-page-container'>
      <div className='tags-header'>
        <div className='tag-title'>{tlist.length} Constellations</div>
      </div>
      <div className='tag_list'>
        {tlist.map((t, idx) => (
          <TagView key={idx} t={t} clickTag={clickTag} />
        ))}
      </div>
    </div>
  );
};

export default TagPage;
