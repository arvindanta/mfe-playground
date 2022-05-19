let MFEEventInstance = null;

const MFEController = window.MFEController;

export function createMFEInstance(namespace) {
  MFEEventInstance = MFEController.init(namespace);
}

export { MFEController, MFEEventInstance };
