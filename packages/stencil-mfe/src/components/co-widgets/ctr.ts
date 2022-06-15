import { FwApplicationStore } from './store';
const _applicationStore = {};

class FwApplicationController {
  init(appName) {
    const appStore = new FwApplicationStore(appName);
    _applicationStore[appName] = appStore;
    return _applicationStore[appName];
  }

  getApplication(appName) {
    if (_applicationStore?.[appName]) {
      return _applicationStore[appName];
    }
    return null;
  }

  registerComponent(appName, id, ref) {
    const appStore = this.getApplication(appName);
    appStore?.registerComponent(id, ref);
  }

  deregisterComponent(appName, id) {
    const appStore = this.getApplication(appName);
    appStore?.deRegisterComponent(id);
  }

  async trigger(appName, componentId, params = null) {
    const appStore = this.getApplication(appName);
    const objResponse = await appStore?.trigger(componentId, params);
    return objResponse;
  }

  async get(appName, params) {
    const appStore = this.getApplication(appName);
    const objResponse = await appStore?.get(params);
    return objResponse;
  }

  on(appName, args) {
    const appStore = this.getApplication(appName);
    appStore?.on(args);
  }

  navigate(appName, params) {
    const appStore = this.getApplication(appName);
    appStore?.navigate(params);
  }

  callback(appName, strAction, params) {
    const appStore = this.getApplication(appName);
    appStore?.callback(strAction, params);
  }

  destroy(appName) {
    const appStore = this.getApplication(appName);
    appStore?.destroy();

    if (_applicationStore?.[appName]) {
      _applicationStore[appName] = null;
      delete _applicationStore[appName];
    }
  }
}

export { FwApplicationController };
