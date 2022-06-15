import React, { useEffect, useRef } from 'react';

function Mfewrapper(props) {
  const ref = useRef();
  const propsString = JSON.stringify(props.appProps);
  useEffect(() => {
    ref.current.appProps = JSON.parse(propsString);
  }, [propsString]);

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
