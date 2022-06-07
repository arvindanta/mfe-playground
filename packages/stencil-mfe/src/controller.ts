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
const MFEController = (window as any).MFEController || stub;

export function createMFEInstance(namespace, cmp) {
  (window as any).log(`setting instance ${namespace}`);
  MFEController.initialiseInstance(namespace, {
    trigger: async (params) => {
      (window as any).log(
        `Calling trigger in ${namespace} with <pre>${JSON.stringify(
          params,
          null,
          2
        )}</pre>`
      );
      (window as any).log(`webc tag is ${cmp.tagName}`);
      return cmp?.trigger?.(params);
    },
  });
}

export { MFEController };
