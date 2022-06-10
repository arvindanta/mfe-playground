import {
  destroyApi,
  fetchObjectAssociations,
  fetchWidget,
  setCouiConfig,
} from '../api/coui';
import FW_APP_CONSTANTS from '../constants/FwApplicationContants';
import { hasCustomProperty } from '../utils/platform-app-utils';

export class FwApplicationStore {
  private _config: any;
  private _fnCallback: any;
  private _appName: string;
  private _store: any;

  constructor(appName) {
    this._store = {};
    this._appName = appName;
  }

  public setConfig(config) {
    this._config = config;
    switch (this._appName) {
      case FW_APP_CONSTANTS.APP_CUSTOM_OBJECT:
        setCouiConfig(this._config);
        break;
      default:
        break;
    }
  }

  public getConfig() {
    return this._config;
  }

  private getApiParams(id) {
    if (this._store?.[id]?.params) {
      return this._store[id].params;
    }
    return null;
  }

  public registerComponent(id, ref, params) {
    if (!this._store[id]) {
      this._store[id] = { component: ref, params: params };
    }
  }

  public deRegisterComponent(id) {
    try {
      if (hasCustomProperty(this._store, id) && this._store[id]) {
        this._store[id].params = null;
        this._store[id].component = null;
        this._store[id] = null;
        delete this._store[id];
      }
    } catch (error) {
      console.info('Error deregistering component - ' + error);
    }
  }

  public async get(params) {
    const strAction = params.action;
    let objResponse;

    switch (this._appName) {
      case FW_APP_CONSTANTS.APP_CUSTOM_OBJECT:
        if (strAction === 'FETCH_ASSOCIATION_SCHEMAS') {
          objResponse = await fetchObjectAssociations(
            this._config,
            params.contextObjectId
          );
          return objResponse?.widgets || null;
        }
        break;
      default:
        break;
    }
  }

  public async trigger(componentId, params = null) {
    let objResponse;
    let componentRef;

    if (!params && this._store?.[componentId]?.component) {
      componentRef = this._store[componentId].component;
      params = this.getApiParams(componentId);
    }

    switch (this._appName) {
      case FW_APP_CONSTANTS.APP_CUSTOM_OBJECT:
        objResponse = await fetchWidget(this._config, params, componentId);
        componentRef?.setValues(objResponse, componentId);
        return objResponse;
      default:
        break;
    }
  }

  public on(fnCallback) {
    this._fnCallback = fnCallback;
  }

  public navigate(params) {
    this.callback(FW_APP_CONSTANTS.ACTION_NAVIGATE, params);
  }

  public callback(strAction, params) {
    if (this._fnCallback) {
      this._fnCallback({
        action: strAction,
        detail: params,
      });
    }
  }

  public destroy() {
    destroyApi();
    this._store = null;
  }
}
