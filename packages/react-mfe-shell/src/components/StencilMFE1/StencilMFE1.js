import React, { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import { FwButton } from '@freshworks/crayons/react';
import { MFEController } from '../../controller';

function StencilMFE1() {
  const ref = useRef(null);

  const navigate = useNavigate();

  window.log('Loading MFE - StencilMFE1');
  useEffect(() => {
    ref.current.appProps = {
      componentType: 'fw-sample1',
      first: 'first',
      middle: 'middle',
      last: 'last',
    };

    const removeSubscriber = MFEController.namespace('mfe4').subscribe(
      'from_child_stencil_webc',
      (msg) => {
        window.log(
          `Message received from webcMFE <pre>${JSON.stringify(
            msg,
            null,
            2
          )}</pre>`
        );
      }
    );

    const removeSubscriber1 = MFEController.namespace('mfe4').subscribe(
      'route_change',
      (msg) => {
        window.log(
          `Routing Message received from MFE <pre>${JSON.stringify(
            msg,
            null,
            2
          )}</pre>`
        );
        window.log(`Navigation to route ${msg.payload.to}`);
        navigate(msg.payload.to);
      }
    );

    const removeSubscriber2 = MFEController.namespace('mfe4').subscribe(
      'from_child_stencil_webc_api',
      (data) => {
        window.log(
          `Message received from webcMFE <pre>${JSON.stringify(
            data?.payload?.params || {},
            null,
            2
          )}</pre>`
        );

        const cb1 = data?.payload?.cb;
        cb1?.({ response: { result: 112123 } });
      }
    );

    return () => {
      window.log('Unmounting MFE - StencilMFE1');
      removeSubscriber();
      removeSubscriber1();
      removeSubscriber2();
    };
  }, [navigate]);

  const sendToMFE = () => {
    MFEController.namespace('mfe4').publish({
      eventName: 'from_app_shell',
      action: {
        type: 'from_app_shell',
        sender: 'app shell',
      },
      payload: 'from app shell',
    });
  };

  const triggerToMFE = async () => {
    const resp = await MFEController.trigger('mfe4', { id: 1123123123 });
    window.log(
      `Getting response from MFE <pre>${JSON.stringify(resp, null, 2)}</pre>`
    );
  };

  return (
    <div>
      <FwButton onClick={sendToMFE}>Send message to MFE</FwButton>
      <br />
      <br />
      <FwButton onClick={triggerToMFE}>
        Call Trigger in MFE and get result
      </FwButton>

      <hr />
      <hr />

      <mfe-application
        ref={ref}
        app-id='stencilMFE1'
        instance-id='mfe4'
        style={{ '--mfe-width': 'calc(58vw)' }}
        id='z'
        registry-url='http://localhost:8002'
        version='0.1.1'
      ></mfe-application>
    </div>
  );
}

export default StencilMFE1;
