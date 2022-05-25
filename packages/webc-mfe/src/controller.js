let MFEInstance = null;
const MFEController = window.MFEController;

export function createMFEInstance(namespace, cmp) {
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
      cmp?.trigger(params);
    },
  });
}

export { MFEController, MFEInstance };
