import { MFEController, createMFEInstance } from './controller';
import { MyComponent } from './component';

const APP_ID = 'webcMFE1';

const TYPE_ELEM_MAPPING = {
  'webc-1': { tag: 'webc-1', cmp: MyComponent },
};

let webcmp = null;
const rootConfig = {
  mount: async (container, appProps) => {
    if (!container) {
      console.info(`APP - ${APP_ID} container not found`);
      return;
    }

    console.info(`MOUNT: ${APP_ID}`, container, appProps);

    // eslint-disable-next-line default-case
    switch (appProps.componentType) {
      case 'webc-1': {
        const { tag, cmp } = TYPE_ELEM_MAPPING[appProps.componentType];
        webcmp = document.createElement(tag);
        webcmp.appProps = appProps;
        Object.keys(appProps).forEach((k) => {
          webcmp[k] = appProps[k];
        });

        // for stencil usecases , make sure the esm bundle is added to manifest. the below can be ignored
        if (!window.customElements.get(tag)) {
          customElements.define(tag, cmp);
        }

        createMFEInstance(appProps.instanceId || 'test-webcid', webcmp);
      }
    }
    if (webcmp) container.appendChild(webcmp);
  },
  unmount: (container) => {
    console.info(`UNMOUNT: ${APP_ID}`);
    container.remove(webcmp);
  },
  async get(params) {
    console.info('params', APP_ID, params);
    return params;
  },
};

MFEController?.registerApplication?.(APP_ID, rootConfig);

window.onload = () => {
  const appProps = MFEController.getMFEQueryParams();
  rootConfig.mount(document.getElementById('webroot'), {
    title: 'test',
    ...appProps,
    componentType: 'webc-1',
  });
};
