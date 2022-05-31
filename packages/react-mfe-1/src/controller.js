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
window.log = window.log || (() => {});

const MFEController = window.MFEController || stub;

export function createMFEInstance(namespace) {
  MFEController.initialiseInstance(namespace, {
    trigger: async (params) => {
      window.log(`Calling trigger in ${namespace} ${params}`);
    },
  });
}

export { MFEController };
