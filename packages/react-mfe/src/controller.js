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
let MFEInstance = null;
export function createMFEInstance(namespace) {
  MFEInstance = MFEController.initialiseInstance(namespace, {
    trigger: async (params) => {
      window.log(`Calling trigger in ${namespace} ${params}`);
    },
  });
}

export { MFEController, MFEInstance };
