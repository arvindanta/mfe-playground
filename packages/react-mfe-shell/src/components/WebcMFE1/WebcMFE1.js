import React, { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import { FwButton } from '@freshworks/crayons/react';
import { MFEController } from '../../controller';

function WebcMFE1() {
  const ref = useRef(null);

  const navigate = useNavigate();

  window.log('Loading MFE - webcMFE1');
  useEffect(() => {
    ref.current.appProps = {
      componentType: 'webc-1',
    };

    const removeSubscriber = MFEController.namespace('mfe3').subscribe?.(
      'from_child_webc',
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

    const removeSubscriber1 = MFEController.namespace('mfe3').subscribe?.(
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

    const removeSubscriber2 = MFEController.namespace('mfe3').subscribe?.(
      'from_child_webc_api',
      (data) => {
        window.log(
          `Message received from webcMFE <pre>${JSON.stringify(
            data?.payload?.params || {},
            null,
            2
          )}</pre>`
        );

        const cb1 = data?.payload?.cb;
        cb1?.({ response: { result: 1 } });
      }
    );

    return () => {
      window.log('Unmounting MFE - webcMFE1');
      removeSubscriber();
      removeSubscriber1();
      removeSubscriber2();
    };
  }, [navigate]);

  const sendToMFE = () => {
    MFEController.namespace('mfe3').publish?.({
      eventName: 'from_app_shell',
      action: {
        type: 'from_app_shell',
        sender: 'app shell',
      },
      payload: 'from app shell',
    });
  };

  const triggerToMFE = async () => {
    const resp = await MFEController.trigger('mfe3', { id: 1 });
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
        app-id='webcMFE1'
        instance-id='mfe3'
        style={{ '--mfe-width': 'calc(58vw)' }}
        id='z'
        registry-url='http://localhost:8001'
        version='0.1.1'
      ></mfe-application>
    </div>
  );
}

export default WebcMFE1;
