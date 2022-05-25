import React from 'react';
import { FwButton } from '@freshworks/crayons/react';

import { MFEInstance } from '../../controller';

function Communication() {
  const mfeToShell = () => {
    window.log('sending message to App Shell from MFE reactMFE2');

    MFEInstance.publish?.({
      eventName: 'from_child_react',
      action: {
        type: 'from_child reactMFE2',
        sender: 'reactMFE2',
      },
      payload: 'from child reactMFE2',
    });
  };

  return (
    <>
      <h1>Communication</h1>
      <FwButton onClick={mfeToShell}>MFE to App Shell</FwButton>
    </>
  );
}

export default Communication;
