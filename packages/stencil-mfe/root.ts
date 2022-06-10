import { MFEController, createMFEInstance } from './src/controller';

(window as any).log = (window as any).log || (() => {});

const APP_ID = 'stencilMFE1';

const instanceId = MFEController.getInstanceId();

(window as any).log(`Loading module for ${instanceId}`);

const TYPE_ELEM_MAPPING = {
  'fw-sample1': { tag: 'fw-sample1' },
  'my-component': { tag: 'my-component' },
  'test-component': { tag: 'test-component' },
  'fw-application': { tag: 'fw-application' },
};

export const rootConfig = {
  mount: async (container, appProps) => {
    if (!container) {
      console.info(`APP - ${APP_ID} container not found`);
      return;
    }
    let webcmp = null;
    console.info(`MOUNT: ${APP_ID}`, container, appProps);

    // eslint-disable-next-line default-case

    const { tag } = TYPE_ELEM_MAPPING[appProps.componentTag];
    webcmp = document.createElement(tag);
    webcmp.appProps = appProps;
    Object.keys(appProps).forEach((k) => {
      webcmp[k] = appProps[k];
    });

    // for stencil usecases , make sure the esm bundle is added to manifest. the below can be ignored
    // if (!(window as any).customElements.get(tag)) {
    //   customElements.define(tag, cmp);
    // }

    createMFEInstance(appProps.instanceId, webcmp);

    if (webcmp) container.appendChild(webcmp);

    return () => {
      console.info(`UNMOUNT: ${APP_ID} - Instance Id - ${appProps.instanceId}`);
      const { tag } = TYPE_ELEM_MAPPING[appProps.componentTag];
      container.remove(tag);
    };
  },

  async get(params) {
    console.info('params', APP_ID, params);
    return params;
  },
};

MFEController.registerAppInstance(instanceId, rootConfig);

(window as any).onload = () => {
  const appProps = MFEController.getMFEQueryParams();
  rootConfig.mount(document.getElementById('stencilroot'), {
    title: 'test',
    ...appProps,
    componentTag: 'fw-sample1',
    instanceId: instanceId || 'mfe5',
  });
};
