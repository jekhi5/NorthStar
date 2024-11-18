import { NavLink } from 'react-router-dom';
import useHeader from '../../hooks/useHeader';
import './index.css';

/**
 * Header component that renders the main title, navigation links, and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown } = useHeader();

  return (
    <div id='header' className='header'>
      <div></div>
      <div className='title'>Fake Stack Overflow</div>
      <div className='headerNav'>
        <NavLink
          to='/home'
          id='menu_questions'
          className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
          Questions
        </NavLink>
        <NavLink
          to='/tags'
          id='menu_tag'
          className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
          Tags
        </NavLink>
        <NavLink
          to='/chatroom'
          id='menu_chatroom'
          className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
          Chatroom
        </NavLink>
      </div>
      <input
        id='searchBar'
        placeholder='Search ...'
        type='text'
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <div className='notifications-and-profile'>
        <div className='notifications-icon'>
          <NavLink to='/notifications'>
            <span className='material-symbols-outlined'>circle_notifications</span>
          </NavLink>
        </div>
        <div className='profile-icon'>
          <NavLink to='/profile'>
            <span className='material-symbols-outlined'>account_circle</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header;
