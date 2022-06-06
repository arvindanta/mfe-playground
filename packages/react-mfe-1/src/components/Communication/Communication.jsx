import React, { useEffect, useRef } from 'react';
import { FwButton } from '@freshworks/crayons/react';

import { MFEController } from '../../controller';

function Communication() {
  const ref = useRef(null);
  let instanceId = null;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    instanceId = MFEController.getInstanceId(ref.current);
  });
  const mfeToShell = () => {
    window.log('sending message to App Shell from MFE reactMFE2');

    MFEController.namespace(instanceId).publish({
      eventName: 'from_child_react',
      action: {
        type: 'from_child reactMFE2',
        sender: 'reactMFE2',
      },
      payload: 'from child reactMFE2',
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
