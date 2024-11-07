import { useEffect, useState } from 'react';
import { getTagByName } from '../services/tagService';
import { Tag, TagData } from '../types';

/**
 * Custom hook to handle fetching tag details by tag name.
 *
 * @param t - The tag object to fetch data for
 *
 * @returns tag - The current tag details (name and description).
 * @returns setTag - Setter to manually update the tag state if needed.
 */
const useTagSelected = (t: TagData) => {
  const [tag, setTag] = useState<Tag>({
    name: '',
    description: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTagByName(t.name);
        setTag(res || { name: 'Error', description: 'Error' });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    };
    fetchData();
  }, [t.name]);

  return {
    tag,
    setTag,
  };
};

export default useTagSelected;
