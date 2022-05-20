import React, { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import { MFEController } from '../../controller';

function MFE() {
  const ref = useRef(null);

  const navigate = useNavigate();

  window.log('Loading MFE - reactMFE');
  useEffect(() => {
    ref.current.appProps = {
      routerBasePath: '/mfe',
    };

    const removeSubscriber = MFEController.init('mfe1').__mfe_subscribe?.(
      'from_child_react',
      (msg) => {
        console.info(`${msg}`);
        window.log(`Message received from MFE ${JSON.stringify(msg)}`);
      }
    );

    const removeSubscriber1 = MFEController.init('mfe1').__mfe_subscribe?.(
      'route_change',
      (msg) => {
        console.info(`${msg}`);
        window.log(`Routing Message received from MFE ${JSON.stringify(msg)}`);
        window.log(`Navigation to route ${msg.payload.to}`);
        navigate(msg.payload.to);
      }
    );

    return () => {
      window.log('Unmounting MFE - reactMFE');
      removeSubscriber();
      removeSubscriber1();
    };
  });

  return (
    <div>
      <mfe-application
        ref={ref}
        app-id='reactMFE'
        instance-id='mfe1'
        style={{ '--mfe-width': 'calc(58vw)' }}
        id='x'
        registry-url='http://localhost:9001'
        version='0.1.1'
      ></mfe-application>
    </div>
  );
}

export default MFE;
