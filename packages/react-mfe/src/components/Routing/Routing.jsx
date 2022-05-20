import React from 'react';
import { FwButton } from '@freshworks/crayons/react';
import { MFEEventInstance } from '../../controller';
function Routing() {
  const mfeToShell = () => {
    window.log('sending message for routing to App Shell from MFE reactMFE');

    MFEEventInstance.__mfe_publish?.({
      eventName: 'route_change',
      action: {
        type: 'from_child reactMFE',
        sender: 'reactMFE',
      },
      payload: { from: window.location.pathname, to: '/about' },
    });
  };
  return (
    <>
      <h1>Routing</h1>
      <FwButton onClick={mfeToShell}>
        MFE Inter routing. Change Route in App Shell from MFE
      </FwButton>
    </>
  );
}

export default Routing;
