/* eslint-disable import/extensions */
import React from 'react';
import style from './Sidebar.module.css';
import NavItem from '../NavItem/NavItem';
import { sideMenu } from './menu.config.js';

const Sidebar = (props) => {
  return (
    <nav className={style.sidebar}>
      {sideMenu.map((item, index) => {
        return <NavItem key={`${item.label}-${index}`} item={item} />;
      })}
    </nav>
  );
};

export default Sidebar;
