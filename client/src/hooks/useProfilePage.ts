import { useContext, useEffect, useState } from 'react';
import { Question, User } from '../types';
import { getUserByUid } from '../services/userService';
import UserContext from '../contexts/UserContext';
import { getQuestionsByAnsweredUid, getQuestionsByUid } from '../services/questionService';

/**
 * Custom hook to manage the state and logic for the profile page.
 *
 * @returns profile - The user's profile data.
 * @returns error - An error message if fetching the profile data fails.
 */
const useProfilePage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userquestions, setUserQuestions] = useState<Question[]>([]);
  const [useranswers, setUserAnswers] = useState<Question[]>([]);

  // Get user, and subsequently user id
  const context = useContext(UserContext);
  const uid = context?.user?.uid;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!uid) {
        setError('UID not available.');
        return;
      }

      try {
        const profileData = await getUserByUid(uid);
        setProfile(profileData);
        const qlist = await getQuestionsByUid(uid);
        setUserQuestions(qlist || []);
        const alist = await getQuestionsByAnsweredUid(uid);
        setUserAnswers(alist || []);
      } catch (err) {
        setError('Failed to load profile.');
      }
    };

    fetchProfile();
  }, [uid]);

  return { profile, error, userquestions, useranswers };
};

export default useProfilePage;
