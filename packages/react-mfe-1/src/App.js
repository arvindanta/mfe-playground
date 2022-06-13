import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { MFEController } from './controller';

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
  const [state, setState] = useState(null);
  const instanceId = props.instanceId;
  const shellUrl = props.shellUrl;

  useEffect(() => {
    const removeSubscriber = MFEController.namespace(instanceId).subscribe(
      'from_app_shell',
      (msg) => {
        window.log(
          `Message received for instance - ${instanceId} from app shell <pre>${JSON.stringify(
            msg,
            null,
            2
          )}</pre>`
        );
        setState(JSON.stringify(msg));
      }
    );

    const removeSubscriber123 = MFEController.namespace(instanceId).subscribe(
      'appPropsChanged',
      (msg) => {
        window.log(
          `Message received for instance - ${instanceId} from app shell appPropsChanged
          <pre>${JSON.stringify(msg, null, 2)}</pre>`
        );
        setState(JSON.stringify(msg));
      }
    );

    const removeSubscriber1 = MFEController.namespace(instanceId).subscribe(
      'route_change_app_shell',
      (msg) => {
        console.info(`${msg}`);
        window.log(
          `Routing Message received for instance - ${instanceId} from app shell <pre>${JSON.stringify(
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
      removeSubscriber123();
    };
  }, [instanceId, navigate]);

  const handleSendMess = () => {
    window.log('sending message to App Shell from MFE reactMFE2');

    MFEController.namespace(instanceId).publish({
      eventName: 'from_child_react',
      action: {
        type: 'from_child reactMFE2',
        sender: 'reactMFE2',
      },
      payload: 'from child reactMFE2',
      targetOrigin: shellUrl,
    });
  };

  const handleSendCbMess = () => {
    window.log('sending message with callback to App Shell from MFE reactMFE2');

    MFEController.namespace(instanceId).publish({
      eventName: 'from_child_react_api',
      action: {
        type: 'from_child reactMFE2 api',
        sender: 'reactMFE2',
      },
      payload: {
        params: { id: 1 },
        cb: (res) => {
          window.log(
            `Response from parent <pre>${JSON.stringify(res, null, 2)}</pre>`
          );
        },
      },
      targetOrigin: shellUrl,
    });
  };

  const mfeToShell = (route) => {
    window.log('sending message for routing to App Shell from MFE reactMFE2');

    MFEController.namespace(instanceId).publish({
      eventName: 'route_change',
      action: {
        type: 'from_child reactMFE2',
        sender: 'reactMFE2',
      },
      payload: { from: window.location.pathname, to: route },
    });
  };

  return (
    <div className='App-mfe'>
      <Suspense fallback={<h1>loading...</h1>}>
        <Navbar />
        <Routes>
          <Route path='/' element={<Contact {...props} state={state} />} />
          <Route path='/about' element={<About />} />
          <Route
            path='/contact'
            element={<Contact {...props} state={state} />}
          />
          <Route
            path='/communication'
            element={
              <Communication
                {...props}
                handleSendMess={handleSendMess}
                handleSendCbMess={handleSendCbMess}
              />
            }
          />
          <Route
            path='/routing'
            element={<Routing {...props} mfeToShell={mfeToShell} />}
          />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
