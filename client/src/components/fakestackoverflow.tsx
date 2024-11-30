import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Layout from './layout';
import Login from './login';
import SignUp from './signup';
import { FakeSOSocket, User } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext from '../contexts/UserContext';
import QuestionPage from './main/questionPage';
import TagPage from './main/tagPage';
import NewQuestionPage from './main/newQuestion';
import NewAnswerPage from './main/newAnswer';
import AnswerPage from './main/answerPage';
import ProfilePage from './main/profilePage';
import NotificationPage from './main/notificationPage';
import Chatroom from './main/chatroom';
import { getUserByUid } from '../services/userService';
import UsersPage from './main/usersPage';

const ProtectedRoute = ({
  user,
  socket,
  children,
}: {
  user: User | null;
  socket: FakeSOSocket | null;
  children: JSX.Element;
}) => {
  if (!user || !socket) {
    return <Navigate to='/' />;
  }

  return <UserContext.Provider value={{ user, socket }}>{children}</UserContext.Provider>;
};

/**
 * Represents the main component of the application.
 * It manages the state for search terms and the main title.
 */
const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showLogIn, setShowLogIn] = useState<boolean>(true);

  useEffect(() => {
    const cookie = Cookies.get('auth');
    if (cookie) {
      getUserByUid(cookie)
        .then(dbUser => {
          if (dbUser) {
            setUser(dbUser);
          }
        })
        // eslint-disable-next-line no-console
        .catch(console.error)
        .finally();
    }
  }, []);

  const componentToShowOnLogin = showLogIn ? (
    <Login showLogIn={showLogIn} setShowLogIn={setShowLogIn} />
  ) : (
    <SignUp showLogIn={showLogIn} setShowLogIn={setShowLogIn} />
  );

  return (
    <LoginContext.Provider value={{ user, setUser }}>
      <Routes>
        {/* Public Route */}
        {!user && (
          <>
            <Route path='/' element={componentToShowOnLogin} />
            {/* You can add other public routes here if needed */}
          </>
        )}
        {/* Protected Routes */}
        {user && (
          <Route
            element={
              <ProtectedRoute user={user} socket={socket}>
                <Layout />
              </ProtectedRoute>
            }>
            <Route path='/home' element={<QuestionPage />} />
            <Route path='tags' element={<TagPage />} />
            <Route path='/question/:qid' element={<AnswerPage />} />
            <Route path='/new/question' element={<NewQuestionPage />} />
            <Route path='/new/answer/:qid' element={<NewAnswerPage />} />
            <Route path='/profile/:username' element={<ProfilePage />} />
            <Route path='/notifications' element={<NotificationPage />} />
            <Route path='/chatroom' element={<Chatroom />} />
            <Route path='/users' element={<UsersPage />} />
          </Route>
        )}
      </Routes>
    </LoginContext.Provider>
  );
};

export default FakeStackOverflow;
