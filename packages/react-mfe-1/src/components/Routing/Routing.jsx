import React, { useRef, useEffect } from 'react';

import { FwButton } from '@freshworks/crayons/react';
import { MFEController } from '../../controller';
function Routing() {
  const ref = useRef(null);
  const instanceId = useRef(null);

  useEffect(() => {
    instanceId.current = MFEController.getInstanceId(ref.current);
  }, []);
  const mfeToShell = (route) => {
    window.log('sending message for routing to App Shell from MFE reactMFE2');

    MFEController.namespace(instanceId.current).publish?.({
      eventName: 'route_change',
      action: {
        type: 'from_child reactMFE2',
        sender: 'reactMFE2',
      },
      payload: { from: window.location.pathname, to: route },
    });
  };
  return (
    <div ref={ref}>
      <h1>Routing</h1>
      <FwButton onClick={() => mfeToShell('/about')}>
        Inter routing. Change Route in App Shell
      </FwButton>

      <br />
      <br />

      <FwButton onClick={() => mfeToShell('/mfe1/about')}>
        Inter routing. Change Route in App Shell to load another MFE - Deep
        Linking
      </FwButton>
    </div>
  );
}

export default Routing;
