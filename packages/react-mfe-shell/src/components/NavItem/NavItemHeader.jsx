import { FwIcon } from '@freshworks/crayons/react';
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import style from './NavItem.module.css';

const resolveLinkPath = (childTo, parentTo) => `${parentTo}/${childTo}`;

const NavItemHeader = (props) => {
  const { item } = props;
  const { label, Icon, to: headerToPath, children } = item;
  const location = useLocation();

  const [expanded, setExpand] = useState(
    location.pathname.includes(headerToPath)
  );

  const onExpandChange = (e) => {
    e.preventDefault();
    setExpand((expanded) => !expanded);
  };

  return (
    <>
      <button
        className={`${style.navItem} ${style.navItemHeaderButton}`}
        onClick={onExpandChange}
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
      </button>

      {expanded && (
        <div className={style.navChildrenBlock}>
          {children.map((item, index) => {
            const key = `${item.label}-${index}`;

            const { label, Icon, children } = item;

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
                to={resolveLinkPath(item.to, props.item.to)}
                className={style.navItem}
                activeClassName={style.activeNavItem}
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
