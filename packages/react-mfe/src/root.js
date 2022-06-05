import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import About from './components/About/About';

import { createMFEInstance, MFEController } from './controller';
window.log = window.log || (() => {});
const APP_ID = 'reactMFE1';

export const rootConfig = {
  mount: async (container, appProps) => {
    let root = null;
    if (!container) {
      console.info(`APP - ${APP_ID} container not found`);
      return;
    }

    createMFEInstance(appProps.instanceId || 'test-id');

    console.info(
      `MOUNTING: instance ${appProps.instanceId} of app group ${APP_ID}, `,
      container,
      appProps
    );

    root = ReactDOM.createRoot(container);
    root.render(
      <BrowserRouter basename={appProps.routerBasePath}>
        <App {...appProps} />
      </BrowserRouter>
    );

    return () => {
      console.info(
        `UNMOUNTING: instance ${appProps.instanceId} of app group ${APP_ID}`
      );
      root?.unmount();
    };
  },

  xyzmount: async (container, appProps) => {
    console.info(
      `MOUNTING: xyz tree with instance ${appProps.instanceId} of app group ${APP_ID}, `,
      container,
      appProps
    );
    createMFEInstance(appProps.instanceId || 'test-id');
    const root = ReactDOM.createRoot(container);
    root.render(
      <BrowserRouter basename={appProps.routerBasePath}>
        <About {...appProps} />
      </BrowserRouter>
    );
    return () => {
      console.info(
        `UNMOUNTING: instance ${appProps.instanceId} of app group ${APP_ID}`
      );
      root?.unmount();
    };
  },

  async get(params) {
    console.info('params', APP_ID, params);
    return params;
  },
};

MFEController?.registerApplication?.(APP_ID, rootConfig);
window.onload = () => {
  const appProps = MFEController.getMFEQueryParams();

  rootConfig.mount(document.getElementById('root'), {
    ...appProps,
    title: 'test',
  });
};
