import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'ember-octane-mfe/config/environment';
import { MFEController, createMFEInstance } from './controller';
export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);

const APP_ID = 'emberMFE1';

const instanceId = MFEController.getInstanceId();

window.log(`Loading module for ${instanceId}`);

export const rootConfig = {
  mount: async (container, appProps) => {
    const instanceId = appProps.instanceId;

    let root = null;
    if (!container) {
      console.info(`APP - ${APP_ID} container not found`);
      return;
    }

    createMFEInstance(appProps.instanceId, appProps);

    console.info(
      `MOUNTING: instance ${instanceId} of app group ${APP_ID}, `,
      container,
      appProps
    );

    // eslint-disable-next-line no-undef
    globalThis[Symbol.for('GLIMMER_VALIDATOR_REGISTRATION')] = false;

    root = App.create({
      // See https://www.emberjs.com/api/ember/2.14.1/classes/Ember.Application
      rootElement: container,
    });

    return () => {
      console.info(`UNMOUNTING: instance ${instanceId} of app group ${APP_ID}`);
      root.destroy();
    };
  },

  async get(params) {
    console.info('params', APP_ID, params);
    return params;
  },
};

MFEController.registerAppInstance(instanceId, rootConfig);

window.onload = () => {
  const appProps = MFEController.getMFEQueryParams();

  rootConfig.mount(document.getElementById('root'), {
    ...appProps,
    title: 'test',
    instanceId: instanceId ?? 'emfe1',
  });
};
