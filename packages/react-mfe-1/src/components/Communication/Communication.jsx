import React from 'react';
import { FwButton } from '@freshworks/crayons/react';

function Communication(props) {
  return (
    <div>
      <h1>Communication</h1>
      <FwButton onClick={props.handleSendMess}>MFE to App Shell</FwButton>
      <br />
      <br />
      <FwButton onClick={props.handleSendCbMess}>
        MFE to App Shell with callback
      </FwButton>
    </div>
  );
}

export default Communication;
