/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import './Statusbar.css';
function Statusbar() {
  return (
    <div className='statusbar' id='statusbar'>
      <div id='status-title'>
        Statusbar
        <a id='clear-log' title='clear log'>
          &times;
        </a>
      </div>
      <div id='status-content'></div>
    </div>
  );
}

export default Statusbar;
