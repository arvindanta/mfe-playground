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
console.info('Top Level Functions here');
let MFEInstance = null;
export function createMFEInstance(namespace) {
  MFEInstance = MFEController.initialiseInstance(namespace, {
    trigger: async (params) => {
      window.log(`Calling trigger in ${namespace} ${params}`);
    },
  });
}

export { MFEController, MFEInstance };
