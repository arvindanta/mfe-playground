import React, { useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { MFEInstance } from './controller';

import './App.css';
import Navbar from './components/Navbar/Navbar';
import NotFound from './components/NotFound/NotFound';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Communication from './components/Communication/Communication';
import Routing from './components/Routing/Routing';

function App(props) {
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    // const instanceId = MFEController.getInstanceId(ref.current);
    // console.info(`instance Id is ${instanceId}`);
    const removeSubscriber = MFEInstance?.subscribe?.(
      'from_app_shell',
      (msg) => {
        window.log(
          `Message received for instance - from app shell <pre>${JSON.stringify(
            msg,
            null,
            2
          )}</pre>`
        );
      }
    );

    const removeSubscriber1 = MFEInstance?.subscribe?.(
      'route_change_app_shell',
      (msg) => {
        console.info(`${msg}`);
        window.log(
          `Routing Message received from app shell <pre>${JSON.stringify(
            msg,
            null,
            2
          )}</pre>`
        );
        window.log(`Navigation to route ${msg.payload.to}`);
        navigate(msg.payload.to);
      }
    );

    return () => {
      removeSubscriber();
      removeSubscriber1();
    };
  }, [navigate]);

  return (
    <div className='App-mfe' ref={ref}>
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
