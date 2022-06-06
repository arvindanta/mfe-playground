import React, { useEffect, useRef } from 'react';
import { FwButton } from '@freshworks/crayons/react';

import { MFEInstance, shellUrl } from '../../controller';

function Communication() {
  const ref = useRef(null);
  // let instanceId = null;

  useEffect(() => {
    //  eslint-disable-next-line react-hooks/exhaustive-deps
    //  instanceId = MFEController.getInstanceId(ref.current);
  });

  const mfeToShell = () => {
    window.log('sending message to App Shell from MFE reactMFE1');

    MFEInstance.publish({
      eventName: 'from_child_react',
      action: {
        type: 'from_child reactMFE1',
        sender: 'reactMFE1',
      },
      payload: 'from child reactMFE1',
      targetOrigin: shellUrl,
    });
  };

  return (
    <div ref={ref}>
      <h1>Communication</h1>
      <FwButton onClick={mfeToShell}>MFE to App Shell</FwButton>
    </div>
  );
}

export default Communication;
