import React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';

/**
 * The SideBarNav component has four menu items: Questions, Tags, Profile, and Chatroom.
 * It highlights the currently selected item based on the active page and
 * triggers corresponding functions when the menu items are clicked.
 */
const SideBarNav = () => (
  <div id='sideBarNav' className='sideBarNav'>
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
      to='/profile'
      id='menu_profile'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      Profile
    </NavLink>
    <NavLink
      to='/notifications'
      id='menu_notifications'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      Notifications
    </NavLink>
    <NavLink
      to='/chatroom'
      id='menu_chatroom'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      Chatroom
    </NavLink>
  </div>
);

export default SideBarNav;
