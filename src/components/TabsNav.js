import React from 'react';
import classNames from 'classnames';

import {
  Link
} from 'react-router';

const TabsNav = props => {
  const {
    activeTabId,
    handleClick,
    tabs
  } = props;

  return (
    <div className="cs-tabs-nav">
      <ul className="nav nav-tabs">
        {tabs.map(tab => {
          const {
            id: tabId,
            label,
            location
          } = tab;

          const navLinkClass = classNames({
            'nav-link': true,
            'active': tabId === activeTabId
          });

          const renderLink = () => {
            if (location) {
              return (
                <Link
                  className={navLinkClass}
                  to={`${location}`}
                >
                  {label}
                </Link>
              );
            }

            return (
              <a
                className={navLinkClass}
                href="javascript:;"
                onClick={handleClick.bind(null, tabId)}
              >{label}</a>
            );
          };

          return (
            <li
              className="nav-item"
              key={tabId}
            >
              {renderLink()}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TabsNav;
