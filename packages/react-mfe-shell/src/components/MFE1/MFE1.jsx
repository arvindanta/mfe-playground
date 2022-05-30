import React, { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import { MFEController } from '../../controller';

function MFE() {
  const ref = useRef(null);
  // const ref1 = useRef(null);

  const navigate = useNavigate();

  window.log('Loading MFE - reactMFE1');
  useEffect(() => {
    ref.current.appProps = {
      routerBasePath: '/mfe1',
    };
    // ref1.current.appProps = {
    //   routerBasePath: '/mfe1',
    // };

    const removeSubscriber = MFEController.namespace('mfe1').subscribe?.(
      'from_child_react',
      (msg) => {
        window.log(
          `Message received from MFE <pre>${JSON.stringify(msg, null, 2)}</pre>`
        );
      }
    );

    // const removeSubscriber10 = MFEController.namespace('mfe10').subscribe?.(
    //   'from_child_react',
    //   (msg) => {
    //     window.log(
    //       `Message received from MFE 10 <pre>${JSON.stringify(
    //         msg,
    //         null,
    //         2
    //       )}</pre>`
    //     );
    //   }
    // );

    const removeSubscriber1 = MFEController.namespace('mfe1').subscribe?.(
      'route_change',
      (msg) => {
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
      window.log('Unmounting MFE - reactMFE1');
      removeSubscriber();
      removeSubscriber1();
      // removeSubscriber10();
    };
  }, [navigate]);

  return (
    <div>
      <mfe-application
        ref={ref}
        app-id='reactMFE1'
        instance-id='mfe1'
        style={{ '--mfe-width': 'calc(58vw)' }}
        id='x'
        registry-url='http://localhost:9001'
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
  );
}

export default MFE;
