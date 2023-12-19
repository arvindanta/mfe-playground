import React, { useRef } from 'react';

function MFE() {
  const ref = useRef(null);

  window.log('Loading MFE - reactMFE3', true);

  return (
    <>
      <div style={{ width: 'calc(63vw)', height: '100%' }}>
        {/* <mfe-application
          ref={ref}
          app-id='ask-freddy'
          instance-id='mfe1'
          id='x'
          registry-url='http://localhost:8091'
        ></mfe-application> */}
        <mfe-application
          ref={ref}
          app-id='reactMFE3'
          instance-id='mfe10'
          id='y'
          registry-url='http://localhost:9003'
          iframe-src='http://localhost:9003/mfe3'
          version='0.1.1'
        ></mfe-application>
      </div>

      {/* <mfe-application
        ref={ref1}
        app-id='reactMFE1'
        instance-id='mfe10'
        style={{ '--mfe-width': 'calc(58vw)' }}
        id='y'
        registry-url='http://localhost:9001'
        version='0.1.1'
      ></mfe-application> */}
    </>
  );
}

export default MFE;
