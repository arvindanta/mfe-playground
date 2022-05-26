import { MFEController, createMFEInstance } from './controller';

const APP_ID = 'stencilMFE1';

const TYPE_ELEM_MAPPING = {
  'fw-sample1': { tag: 'fw-sample1' },
  'my-component': { tag: 'my-component' },
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

    const { tag } = TYPE_ELEM_MAPPING[appProps.type];
    webcmp = document.createElement(tag);
    webcmp.appProps = appProps;

    // for stencil usecases , make sure the esm bundle is added to manifest. the below can be ignored
    // if (!window.customElements.get(tag)) {
    //   customElements.define(tag, cmp);
    // }

    createMFEInstance(appProps.instanceId || 'test-swebcid', webcmp);

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
  rootConfig.mount(document.getElementById('stencilroot'), {
    title: 'test',
    ...appProps,
    type: 'fw-sample1',
  });
};
