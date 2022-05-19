import React, { useEffect, useRef } from 'react';

import { MFEController } from '../../controller';

function MFE() {
  const ref = useRef(null);

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

    return () => {
      window.log('Unmounting MFE - reactMFE');
      removeSubscriber();
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
