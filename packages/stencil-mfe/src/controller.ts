const MFEController = (window as any).MFEController;

export function createMFEInstance(namespace: string, cmp: any) {
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
