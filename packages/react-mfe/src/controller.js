let MFEInstance = null;

const MFEController = window.MFEController;

export function createMFEInstance(namespace) {
  MFEInstance = MFEController.initialiseInstance(namespace, {
    trigger: async (params) => {
      window.log(`Calling trigger in ${namespace} ${params}`);
    },
  });
}

export { MFEController, MFEInstance };
