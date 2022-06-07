const stub = {
  initialiseInstance: () => {
    return stub.namespace();
  },
  namespace: () => {
    return {
      publish: () => {},
      subscribe: () => {
        return () => {};
      },
    };
  },
  registerAppInstance: () => {},
  getInstanceId: () => {},
  getMFEQueryParams: () => {},
  get: async () => {},
};
const MFEController = window.MFEController || stub;
let MFEInstance = null;
let shellUrl = '';
export function createMFEInstance(namespace, appProps, cmp) {
  window.log(`setting instance ${namespace}`);
  shellUrl = appProps.shellUrl;
  MFEInstance = MFEController.initialiseInstance(namespace, {
    trigger: async (params) => {
      window.log(
        `Calling trigger in ${namespace} with <pre>${JSON.stringify(
          params,
          null,
          2
        )}</pre>`
      );
      window.log(`webc tag is ${cmp.tagName}`);
      return cmp?.trigger?.(params);
    },
  });
}

export { MFEController, MFEInstance, shellUrl };
