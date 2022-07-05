import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { MFEController } from '../../controller';

function EmberMFE() {
  // const ref = useRef(null);
  // const ref1 = useRef(null);

  const navigate = useNavigate();

  window.log('Loading MFE - emberMFE1', true);
  useEffect(() => {
    // ref.current.appProps = {
    //   routerBasePath: '/embermfe',
    // };
    // ref1.current.appProps = {
    //   routerBasePath: '/mfe1',
    // };

    const removeSubscriber = MFEController.namespace('embmfe').subscribe(
      'from_child_ember',
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

    const removeSubscriber1 = MFEController.namespace('embmfe').subscribe(
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

    return () => {
      window.log('Unmounting MFE - emberMFE1', true);
      removeSubscriber();
      removeSubscriber1();
    };
  }, [navigate]);

  return (
    <>
      <div style={{ width: 'calc(63vw)', height: '400px' }}>
        <mfe-application
          app-id='emberMFE1'
          instance-id='embmfe'
          id='x'
          registry-url='http://localhost:8001'
          iframe-src='http://localhost:8001/embmfe'
          version='0.1.1'
        ></mfe-application>
      </div>
      {/* <div style={{ width: 'calc(63vw)', height: '400px' }}> */}

      {/* <mfe-application
        ref={ref1}
        app-id='emberMFE1'
        instance-id='mfe10'
        style={{ '--mfe-width': 'calc(58vw)' }}
        id='y'
        registry-url='http://localhost:9001'
        version='0.1.1'
      ></mfe-application> */}
      {/* </div> */}
    </>
  );
}

export default EmberMFE;
