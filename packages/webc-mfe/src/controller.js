const stub = {
  initialiseInstance: () => {},
  namespace: () => {
    return {
      publish: () => {},
      subscribe: () => {
        return () => {};
      },
    };
  },
  registerApplication: () => {},
  getInstanceId: () => {},
  getMFEQueryParams: () => {},
  get: async () => {},
};

const MFEController = window.MFEController || stub;

export function createMFEInstance(namespace, cmp) {
  MFEController.initialiseInstance(namespace, {
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

export { MFEController };
