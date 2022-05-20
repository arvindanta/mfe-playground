import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';
import NotFound from './components/NotFound/NotFound';
import About from './components/About/About';
import MFE from './components/MFE/MFE';
import Sidebar from './components/Sidebar/Sidebar';
// import Statusbar from './components/Statusbar/Statusbar';

import './util';

function App(props) {
  return (
    <div className='App'>
      <div className='App_container'>
        <Sidebar />
        <div className='content'>
          <Routes>
            <Route path='/' element={<About />} />
            <Route path='/about' element={<About />} />
            <Route path='/mfe/*' element={<MFE {...props} />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
        {/* <Statusbar /> */}
      </div>
    </div>
  );
}

export default App;
