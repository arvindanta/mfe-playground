import React from 'react';
import { NavLink } from 'react-router-dom';
import style from './NavItem.module.css';
import NavItemHeader from './NavItemHeader';
import { FwIcon } from '@freshworks/crayons/react';

const NavItem = (props) => {
  const { label, Icon, to, children } = props.item;

  if (children) {
    return <NavItemHeader item={props.item} />;
  }

  return (
    <NavLink
      exact='true'
      to={to}
      className={style.navItem}
      activeClassName={style.activeNavItem}
    >
      <FwIcon size='20' name={Icon} className={style.navIcon}></FwIcon>
      <span className={style.navLabel}>{label}</span>
    </NavLink>
  );
};

export default NavItem;
