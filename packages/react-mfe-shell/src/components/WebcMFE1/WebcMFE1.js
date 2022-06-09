import React, { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import { FwButton } from '@freshworks/crayons/react';
import { MFEController } from '../../controller';

function WebcMFE1() {
  const ref = useRef(null);
  const ref1 = useRef(null);

  const navigate = useNavigate();

  window.log('Loading MFE - webcMFE1');
  useEffect(() => {
    ref.current.appProps = {
      componentType: 'webc-1',
    };
    ref1.current.appProps = {
      componentType: 'webc-1',
    };

    const removeSubscriber = MFEController.namespace('mfe3').subscribe(
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

    const removeSubscriber123 = MFEController.namespace('mfe12').subscribe(
      'from_child_webc',
      (msg) => {
        window.log(
          `Message received from webcMFE 12 <pre>${JSON.stringify(
            msg,
            null,
            2
          )}</pre>`
        );
      }
    );

    const removeSubscriber1 = MFEController.namespace('mfe3').subscribe(
      'route_change',
      (msg) => {
        window.log(
          `Routing Message received from webMFE <pre>${JSON.stringify(
            msg,
            null,
            2
          )}</pre>`
        );
        window.log(`Navigation to route ${msg.payload.to}`);
        navigate(msg.payload.to);
      }
    );

    const removeSubscriber2 = MFEController.namespace('mfe3').subscribe(
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
        cb1?.({ response: { result: 1, mfe: 3 } });
      }
    );

    const removeSubscriber12 = MFEController.namespace('mfe12').subscribe(
      'route_change',
      (msg) => {
        window.log(
          `Routing Message received from webMFE 12 <pre>${JSON.stringify(
            msg,
            null,
            2
          )}</pre>`
        );
        window.log(`Navigation to route ${msg.payload.to}`);
        navigate(msg.payload.to);
      }
    );

    const removeSubscriber22 = MFEController.namespace('mfe12').subscribe(
      'from_child_webc_api',
      (data) => {
        window.log(
          `Message received from webcMFE 12 <pre>${JSON.stringify(
            data?.payload?.params || {},
            null,
            2
          )}</pre>`
        );

        const cb1 = data?.payload?.cb;
        cb1?.({ response: { result: 1, mfe: 12 } });
      }
    );

    return () => {
      window.log('Unmounting MFE - webcMFE1');
      removeSubscriber();
      removeSubscriber1();
      removeSubscriber2();
      removeSubscriber123();
      removeSubscriber12();
      removeSubscriber22();
    };
  }, [navigate]);

  const sendToMFE = () => {
    MFEController.namespace('mfe3').publish({
      eventName: 'from_app_shell',
      action: {
        type: 'from_app_shell',
        sender: 'app shell',
      },
      payload: 'from app shell',
    });
  };

  const triggerToMFE = async () => {
    const resp = await MFEController.trigger('mfe3', { id: 1, mfe: 'mfe3' });
    window.log(
      `Getting response from webMFE <pre>${JSON.stringify(resp, null, 2)}</pre>`
    );
  };

  const sendToMFE12 = () => {
    MFEController.namespace('mfe12').publish({
      eventName: 'from_app_shell',
      action: {
        type: 'from_app_shell',
        sender: 'app shell',
      },
      payload: 'from app shell',
    });
  };

  const triggerToMFE12 = async () => {
    const resp = await MFEController.trigger('mfe12', { id: 1, mfe: 'mfe12' });
    window.log(
      `Getting response from webMFE 12 <pre>${JSON.stringify(
        resp,
        null,
        2
      )}</pre>`
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
      <FwButton onClick={sendToMFE12}>Send message to MFE12</FwButton>
      <br />
      <br />
      <FwButton onClick={triggerToMFE12}>
        Call Trigger in MFE and get result12
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

      {/* <h3>second instance</h3> */}
      <mfe-application
        ref={ref1}
        app-id='webcMFE1'
        instance-id='mfe12'
        style={{ '--mfe-width': 'calc(58vw)' }}
        id='asd'
        registry-url='http://localhost:8001'
        version='0.1.1'
      ></mfe-application>
    </div>
  );
}

export default WebcMFE1;
