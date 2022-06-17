import React, { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import { MFEController } from '../../controller';

function MFE() {
  const ref = useRef(null);
  const ref1 = useRef(null);

  const navigate = useNavigate();

  window.log('Loading MFE - reactMFE1', true);
  useEffect(() => {
    ref.current.appProps = {
      routerBasePath: '/mfe1',
    };
    ref1.current.appProps = {
      routerBasePath: '/mfe1',
    };

    const removeSubscriber = MFEController.namespace('mfe1').subscribe(
      'from_child_react',
      (msg) => {
        window.log(
          `Message received from MFE <pre>${JSON.stringify(
            msg,
            null,
            2
          )}</pre>`,
          true
        );
      }
    );

    const removeSubscriber10 = MFEController.namespace('mfe10').subscribe(
      'from_child_react',
      (msg) => {
        window.log(
          `Message received from MFE 10 <pre>${JSON.stringify(
            msg,
            null,
            2
          )}</pre>`,
          true
        );
      }
    );

    const removeSubscriber1 = MFEController.namespace('mfe1').subscribe(
      'route_change',
      (msg) => {
        window.log(
          `Routing Message received from MFE <pre>${JSON.stringify(
            msg,
            null,
            2
          )}</pre>`,
          true
        );
        window.log(`Navigation to route ${msg.payload.to}`, true);
        navigate(msg.payload.to);
      }
    );

    const removeSubscriber12 = MFEController.namespace('mfe10').subscribe(
      'route_change',
      (msg) => {
        window.log(
          `Routing Message received from MFE 10 <pre>${JSON.stringify(
            msg,
            null,
            2
          )}</pre>`,
          true
        );
        window.log(`Navigation to route ${msg.payload.to}`, true);
        navigate(msg.payload.to);
      }
    );

    return () => {
      window.log('Unmounting MFE - reactMFE1', true);
      removeSubscriber();
      removeSubscriber1();
      removeSubscriber10();
      removeSubscriber12();
    };
  }, [navigate]);

  return (
    <>
      <div style={{ width: 'calc(63vw)', height: '400px' }}>
        <mfe-application
          ref={ref}
          app-id='reactMFE1'
          instance-id='mfe1'
          id='x'
          registry-url='http://localhost:9001'
          iframe-src='http://localhost:9001/mfe1'
          version='0.1.1'
        ></mfe-application>
      </div>
      <div style={{ width: 'calc(63vw)', height: '400px' }}>
        <mfe-application
          ref={ref1}
          app-id='reactMFE1'
          instance-id='mfe10'
          id='y'
          registry-url='http://localhost:9001'
          iframe-src='http://localhost:9001/mfe1'
          version='0.1.1'
        ></mfe-application>

        {/* <mfe-application
        ref={ref1}
        app-id='reactMFE1'
        instance-id='mfe10'
        style={{ '--mfe-width': 'calc(58vw)' }}
        id='y'
        registry-url='http://localhost:9001'
        version='0.1.1'
      ></mfe-application> */}
      </div>
    </>
  );
}

export default MFE;
