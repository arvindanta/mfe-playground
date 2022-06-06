import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { MFEInstance } from './controller';

import './App.css';
import Navbar from './components/Navbar/Navbar';

const Contact = lazy(() => import('./components/Contact/Contact'));
const NotFound = lazy(() => import('./components/NotFound/NotFound'));
const About = lazy(() => import('./components/About/About'));
const Communication = lazy(() =>
  import('./components/Communication/Communication')
);
const Routing = lazy(() => import('./components/Routing/Routing'));

function App(props) {
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    // const instanceId = MFEController.getInstanceId(ref.current);
    // console.info(`instance Id is ${instanceId}`);
    const removeSubscriber = MFEInstance.subscribe('from_app_shell', (msg) => {
      window.log(
        `Message received for instance - from app shell <pre>${JSON.stringify(
          msg,
          null,
          2
        )}</pre>`
      );
    });

    const removeSubscriber1 = MFEInstance.subscribe(
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
      <Suspense fallback={<h1>loading...</h1>}>
        <Navbar />
        <Routes>
          <Route path='/' element={<Contact {...props} />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact {...props} />} />
          <Route path='/communication' element={<Communication {...props} />} />
          <Route path='/routing' element={<Routing {...props} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
