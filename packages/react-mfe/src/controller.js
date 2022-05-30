const MFEController = window.MFEController;

export function createMFEInstance(namespace) {
  MFEController.initialiseInstance(namespace, {
    trigger: async (params) => {
      window.log(`Calling trigger in ${namespace} ${params}`);
    },
  });
}

export { MFEController };
