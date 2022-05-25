import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import About from './components/About/About';

import { createMFEInstance, MFEController } from './controller';

const APP_ID = 'reactMFE2';

const rootConfig = {
  mount: async (container, appProps) => {
    if (!container) {
      console.info(`APP - ${APP_ID} container not found`);
      return;
    }

    createMFEInstance(appProps.instanceId || 'test-id1');

    console.info(
      `MOUNTING: instance ${appProps.instanceId} of app group ${APP_ID}, `,
      container,
      appProps
    );

    const root = ReactDOM.createRoot(container);
    root.render(
      <BrowserRouter basename={appProps.routerBasePath}>
        <App {...appProps} />
      </BrowserRouter>
    );
  },
  unmount: async (container, appProps) => {
    console.info(
      `UNMOUNTING: instance ${appProps.instanceId} of app group ${APP_ID}`
    );
    ReactDOM.unmountComponentAtNode(container);
  },

  xyzmount: async (container, appProps) => {
    console.info(
      `MOUNTING: xyz tree with instance ${appProps.instanceId} of app group ${APP_ID}, `,
      container,
      appProps
    );

    const root = ReactDOM.createRoot(container);
    root.render(
      <BrowserRouter basename={appProps.routerBasePath}>
        <About {...appProps} />
      </BrowserRouter>
    );
  },
  xyzunmount: async (container, appProps) => {
    console.info(
      `UNMOUNTING: instance ${appProps.instanceId} of app group ${APP_ID}`
    );
    ReactDOM.unmountComponentAtNode(container);
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
