/* eslint-disable no-console */
/* eslint-disable default-case */
import {
  Component,
  Element,
  Prop,
  h,
  Host,
  Method,
  State,
  Watch,
} from '@stencil/core';
import { FwApplicationController } from './app';
import { FwApplicationStore } from './store/FwApplicationStore';
import FW_APP_CONSTANTS from './constants/FwApplicationContants';
import {
  getSelectedSearchRecord,
  linkNewRecord,
  searchEntityRecords,
} from './api/coui';

@Component({
  tag: 'fw-application',
  shadow: true,
})
export class FwApplication {
  @Element() host!: HTMLElement;

  private refDisplayComponent;
  private boolParamsChanged = false;
  private boolComponentIdChanged = false;
  private storeInstance?: FwApplicationStore;

  @Prop() applicationName?: string = '';
  @Prop() componentType?: string = '';
  @Prop() componentId?: string = '';
  @Prop() params = null;

  @State() loading = true;

  @Watch('params')
  watchParamsChangeHandler(): void {
    this.boolParamsChanged = true;
    this.validateTrigger();
  }

  @Watch('componentId')
  watchComponentIdChangeHandler(): void {
    this.boolComponentIdChanged = true;
    this.validateTrigger();
  }

  @Method()
  async setValues(values, compId) {
    if (this.componentId === compId && this.refDisplayComponent) {
      this.refDisplayComponent.setValues(values);
    }
    this.loading = false;
  }

  async validateTrigger() {
    if (
      this.boolComponentIdChanged &&
      this.boolParamsChanged &&
      this.storeInstance
    ) {
      this.boolComponentIdChanged = false;
      this.boolParamsChanged = false;
      this.loading = true;
      this.storeInstance?.registerComponent(
        this.componentId,
        this,
        this.params
      );
      this.storeInstance?.trigger(this.componentId);
    }
  }

  async componentWillLoad() {
    this.loading = true;
    this.storeInstance = FwApplicationController.getApplication(
      this.applicationName
    );
    this.storeInstance?.registerComponent(this.componentId, this, this.params);
  }

  async componentDidLoad() {
    this.loading = true;
    this.storeInstance?.trigger(this.componentId);
  }

  disconnectedCallback(): void {
    if (this.storeInstance) {
      this.storeInstance.deRegisterComponent(this.componentId);
    }
    this.loading = false;
  }

  private navigateHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();

    FwApplicationController.navigate(FW_APP_CONSTANTS.APP_CUSTOM_OBJECT, {
      url: event.detail.route,
      type: 'CTA_PRIMARY_FIELD',
    });
  };

  private viewAllRecordsHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();

    FwApplicationController.navigate(FW_APP_CONSTANTS.APP_CUSTOM_OBJECT, {
      url: event.detail.route,
      type: 'CTA_VIEW_ALL_RECORDS',
    });
  };

  private fetchDataHandler = async (strAction, objDetails) => {
    let objResponse;
    switch (strAction) {
      case 'SEARCH_RECORD':
        objResponse = await searchEntityRecords(objDetails);
        return objResponse;
      case 'SEARCH_SELECT':
        objResponse = await getSelectedSearchRecord(objDetails);
        return objResponse;
      case 'LINK_RECORD':
        objResponse = await linkNewRecord(objDetails);
        return objResponse;
    }
  };

  renderWebComponent() {
    console.log('render web');
    const componentTagName = FW_APP_CONSTANTS.COMPONENT_TAG[this.componentType];
    let template: JSX.Element = null;
    console.log(componentTagName);
    if (window.customElements.get(componentTagName)) {
      const WebComponentTag = `${componentTagName}`;
      template = (
        <WebComponentTag
          ref={(el) => (this.refDisplayComponent = el)}
          params={this.params}
          loading={this.loading}
          componentId={this.componentId}
          onFwNavigate={this.navigateHandler}
          onFwViewAllRecords={this.viewAllRecordsHandler}
          fetchData={this.fetchDataHandler}
        ></WebComponentTag>
      );
    }
    return template;
  }

  render() {
    return <Host tabIndex='-1'>{this.renderWebComponent()}</Host>;
  }
}
