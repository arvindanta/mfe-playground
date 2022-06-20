import React, { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import { MFEController } from '../../controller';

function MFE2() {
  const ref = useRef(null);
  const ref1 = useRef(null);

  const navigate = useNavigate();

  window.log('Loading MFE - reactMFE2', true);
  useEffect(() => {
    ref.current.appProps = {
      routerBasePath: '/mfe2',
    };
    ref1.current.appProps = {
      routerBasePath: '/mfe2',
    };

    setTimeout(() => {
      ref.current.appProps = {
        newProp: 'newProp',
      };
    }, 5000);

    const removeSubscriber = MFEController.namespace('mfe2').subscribe(
      'from_child_react',
      (msg) => {
        window.log(
          `Message received from MFE 2 <pre>${JSON.stringify(
            msg,
            null,
            2
          )}</pre>`,
          true
        );
      }
    );

    const removeSubscriber10 = MFEController.namespace('mfe20').subscribe(
      'from_child_react',
      (msg) => {
        window.log(
          `Message received from MFE 20 <pre>${JSON.stringify(
            msg,
            null,
            2
          )}</pre>`,
          true
        );
      }
    );

    const removeSubscriber1 = MFEController.namespace('mfe2').subscribe(
      'route_change',
      (msg) => {
        window.log(
          `Routing Message received from MFE 2 <pre>${JSON.stringify(
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

    const removeSubscriber12 = MFEController.namespace('mfe20').subscribe(
      'route_change',
      (msg) => {
        window.log(
          `Routing Message received from MFE 20 <pre>${JSON.stringify(
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

    const removeSubscriber21 = MFEController.namespace('mfe2').subscribe(
      'from_child_react_api',
      (data) => {
        window.log(
          `Message received from mfe 2 <pre>${JSON.stringify(
            data?.payload?.params || {},
            null,
            2
          )}</pre>`,
          true
        );

        const cb1 = data?.payload?.cb;
        cb1?.({ response: { result: 112123, id: 'mfe2' } });
      }
    );

    const removeSubscriber22 = MFEController.namespace('mfe20').subscribe(
      'from_child_react_api',
      (data) => {
        window.log(
          `Message received from mfe 20 <pre>${JSON.stringify(
            data?.payload?.params || {},
            null,
            2
          )}</pre>`,
          true
        );

        const cb1 = data?.payload?.cb;
        cb1?.({ response: { result: 112123, id: 'mfe20' } });
      }
    );

    return () => {
      window.log('Unmounting MFE - reactMFE2', true);
      removeSubscriber();
      removeSubscriber1();
      removeSubscriber10();
      removeSubscriber12();
      removeSubscriber22();
      removeSubscriber21();
    };
  }, [navigate]);

  return (
    <>
      <div style={{ width: 'calc(63vw)', height: '400px' }}>
        <mfe-application
          ref={ref}
          app-id='reactMFE2'
          instance-id='mfe2'
          style={{ '--mfe-width': 'calc(63vw)' }}
          id='x'
          registry-url='http://localhost:9002'
          iframe-src='http://localhost:9002/mfe2'
          version='0.1.1'
        ></mfe-application>
      </div>
      <div style={{ width: 'calc(63vw)', height: '400px' }}>
        <mfe-application
          ref={ref1}
          app-id='reactMFE2'
          instance-id='mfe20'
          style={{ '--mfe-width': 'calc(63vw)' }}
          id='y'
          registry-url='http://localhost:9002'
          iframe-src='http://localhost:9002/mfe2'
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

export default MFE2;
