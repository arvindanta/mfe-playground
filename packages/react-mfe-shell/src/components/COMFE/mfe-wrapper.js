import React, { useEffect, useRef } from 'react';

function Mfewrapper(props) {
  const ref = useRef();
  useEffect(() => {
    ref.current.appProps = props.appProps;
  }, [props.appProps]);

  return (
    <mfe-application
      app-id='stencilMFE1'
      registry-url='http://localhost:8002'
      style={{ '--mfe-width': '100%', '--mfe-height': '200px' }}
      instance-id={props.appProps.componentId}
      ref={ref}
    />
  );
}

export default Mfewrapper;
