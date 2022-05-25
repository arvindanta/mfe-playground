/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import menuItems from './Menuitems';
import './Navbar.css';

const Navbar = () => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <nav className='navbar'>
      <h1 className='navbar-logo'>
        React MFE 1 <i className='fab fa-react'></i>
      </h1>
      <div className='menu-icon' onClick={handleClick}>
        <i className={active ? 'fas fa-times' : 'fas fa-bars'}></i>
      </div>
      <ul className={active ? 'nav-menu active' : 'nav-menu'}>
        {menuItems.map((item, index) => {
          return (
            <li key={index}>
              <Link to={item.url} className={item.cName}>
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
