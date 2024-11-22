import { useEffect, useState } from 'react';
import { getTagByName } from '../services/tagService';
import { Question, Tag, TagData } from '../types';
import useUserContext from './useUserContext';

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
    subscribers: [],
  });

  const { socket } = useUserContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTagByName(t.name);
        setTag(res || { name: 'Error', description: 'Error' });
      } catch (error) {
        // We log the errors here, but we do not throw an error as we do not want to block the
        // user from viewing the site just because the tag failed to be found.
        if (error instanceof Error) {
          // eslint-disable-next-line no-console
          console.error('Error fetching tag:', error.message);
        } else {
          // eslint-disable-next-line no-console
          console.error('Error fetching tag:', error);
        }
      }
    };
    fetchData();

    /**
     * Function to handle updates to the subscribers of a question.
     *
     * @param result - The updated question object.
     */
    const handleSubscriberUpdate = ({
      result,
      type,
    }: {
      result: Question | Tag;
      type: 'question' | 'tag';
    }) => {
      if (type === 'tag' && result._id === tag._id) {
        setTag(result as Tag);
      }
    };

    socket.on('subscriberUpdate', handleSubscriberUpdate);

    return () => {
      socket.off('subscriberUpdate', handleSubscriberUpdate);
    };
  }, [socket, t.name, tag._id]);

  return {
    tag,
    setTag,
  };
};

export default useTagSelected;
