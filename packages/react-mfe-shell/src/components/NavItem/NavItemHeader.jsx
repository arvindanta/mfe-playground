import { FwIcon } from '@freshworks/crayons/react';
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import style from './NavItem.module.css';

const resolveLinkPath = (childTo, parentTo) => `${parentTo}/${childTo}`;

const NavItemHeader = (props) => {
  const { item } = props;
  const { label, Icon, to: headerToPath, children } = item;
  const location = useLocation();
  const navigate = useNavigate();

  const [expanded, setExpand] = useState(
    location.pathname.includes(headerToPath)
  );

  const onExpandChange = (e, to) => {
    e.preventDefault();
    setExpand((expanded) => !expanded);
    navigate(to);
  };

  return (
    <>
      <NavLink
        className={`${style.navItem}`}
        onClick={(e) => onExpandChange(e, props.item.to)}
        to={props.item.to}
      >
        <FwIcon name={Icon} size='20' className={style.navIcon}></FwIcon>
        <span className={style.navLabel}>{label}</span>

        {expanded && (
          <FwIcon
            size='20'
            name='chevron-down'
            className={`${style.navItemHeaderChevron}`}
          ></FwIcon>
        )}

        {!expanded && (
          <FwIcon
            name='chevron-up'
            size='20'
            className={`${style.navItemHeaderChevron}`}
          ></FwIcon>
        )}
      </NavLink>

      {expanded && (
        <div className={style.navChildrenBlock}>
          {children.map((item, index) => {
            const key = `${item.label}-${index}`;

            const { label, Icon, children, onClick } = item;

            if (children) {
              return (
                <div key={key}>
                  <NavItemHeader
                    item={{
                      ...item,
                      to: resolveLinkPath(item.to, props.item.to),
                    }}
                  />
                </div>
              );
            }

            return (
              <NavLink
                key={key}
                to={
                  (item.to && resolveLinkPath(item.to, props.item.to)) ||
                  props.item.to
                }
                onClick={(e) => {
                  console.info('ffs');
                  e.preventDefault();
                  onClick?.(e);
                }}
                // activeClassName is replaced with className for react-router-v6
                className={({ isActive }) =>
                  isActive
                    ? `${style.navItem} ${style.activeNavItem}`
                    : `${style.navItem}`
                }
              >
                <FwIcon
                  name={Icon}
                  size='20'
                  className={style.navIcon}
                ></FwIcon>
                <span className={style.navLabel}>{label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </>
  );
};

export default NavItemHeader;
