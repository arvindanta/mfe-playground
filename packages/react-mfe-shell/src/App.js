import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import NotFound from './components/NotFound/NotFound';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Communication from './components/Communication/Communication';
import Routing from './components/Routing/Routing';
import Sidebar from './components/Sidebar/Sidebar';
import Statusbar from './components/Statusbar/Statusbar';

function App(props) {
  return (
    <div className='App'>
      <BrowserRouter>
        <div className='App_container'>
          <Sidebar />
          <div className='content'>
            <Routes>
              <Route path='/' element={<Contact {...props} />} />
              <Route path='/about' element={<About />} />
              <Route path='/contact' element={<Contact {...props} />} />
              <Route
                path='/communication'
                element={<Communication {...props} />}
              />
              <Route path='/routing' element={<Routing {...props} />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
          <Statusbar />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
