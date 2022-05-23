import React, { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import { MFEController } from '../../controller';

function MFE2() {
  const ref = useRef(null);

  const navigate = useNavigate();

  window.log('Loading MFE - reactMFE2');
  useEffect(() => {
    ref.current.appProps = {
      routerBasePath: '/mfe2',
    };

    const removeSubscriber = MFEController.init('mfe2').subscribe?.(
      'from_child_react',
      (msg) => {
        console.info(`${msg}`);
        window.log(
          `Message received from MFE <pre>${JSON.stringify(msg, null, 2)}</pre>`
        );
      }
    );

    const removeSubscriber1 = MFEController.init('mfe2').subscribe?.(
      'route_change',
      (msg) => {
        console.info(`${msg}`);
        window.log(
          `Routing Message received from MFE <pre>${JSON.stringify(
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
      window.log('Unmounting MFE - reactMFE2');
      removeSubscriber();
      removeSubscriber1();
    };
  }, [navigate]);

  return (
    <div>
      <mfe-application
        ref={ref}
        app-id='reactMFE2'
        instance-id='mfe2'
        style={{ '--mfe-width': 'calc(58vw)' }}
        id='y'
        registry-url='http://localhost:9002'
        version='0.1.1'
      ></mfe-application>
    </div>
  );
}

export default MFE2;
