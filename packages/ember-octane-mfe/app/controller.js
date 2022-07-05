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
let MFEInstance = null;
let shellUrl = null;
export function createMFEInstance(namespace, props) {
  shellUrl = props.shellUrl;
  MFEInstance = MFEController.initialiseInstance(namespace, {
    trigger: async (params) => {
      window.log(`Calling trigger in ${namespace} ${params}`);
    },
  });
}

/** for demo */
function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
const defaultLog = inIframe()
  ? (msg) => window.top.postMessage({ log: msg }, '*')
  : () => {};
window.log = window.log || defaultLog;
// end for demo

export { MFEController, MFEInstance, shellUrl };
