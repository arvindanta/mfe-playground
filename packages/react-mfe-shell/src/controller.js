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
  prefetch: () => {},
};

const MFEController = window.MFEController || stub;

export { MFEController };
