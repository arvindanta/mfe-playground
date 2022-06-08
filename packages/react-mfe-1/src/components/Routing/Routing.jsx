import React from 'react';

import { FwButton } from '@freshworks/crayons/react';

function Routing(props) {
  const mfeToShell = props.mfeToShell;
  return (
    <div>
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
