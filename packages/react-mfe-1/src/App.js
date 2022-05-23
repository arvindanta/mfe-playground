import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { MFEEventInstance } from './controller';

import './App.css';
import Navbar from './components/Navbar/Navbar';
import NotFound from './components/NotFound/NotFound';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Communication from './components/Communication/Communication';
import Routing from './components/Routing/Routing';

function App(props) {
  const navigate = useNavigate();
  useEffect(() => {
    const removeSubscriber = MFEEventInstance.__mfe_subscribe?.(
      'from_app_shell',
      (msg) => {
        console.info(`${msg}`);
        window.log(`Message received from app shell ${JSON.stringify(msg)}`);
      }
    );

    const removeSubscriber1 = MFEEventInstance.__mfe_subscribe?.(
      'route_change_app_shell',
      (msg) => {
        console.info(`${msg}`);
        window.log(
          `Routing Message received from app shell ${JSON.stringify(msg)}`
        );
        window.log(`Navigation to route ${msg.payload.to}`);
        navigate(msg.payload.to);
      }
    );

    return () => {
      removeSubscriber();
      removeSubscriber1();
    };
  });

  return (
    <div className='App-mfe'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Contact {...props} />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact {...props} />} />
        <Route path='/communication' element={<Communication {...props} />} />
        <Route path='/routing' element={<Routing {...props} />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
