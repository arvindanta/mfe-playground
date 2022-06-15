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
} from '@stencil/core';
import FW_APP_CONSTANTS, {
  APP_ID,
} from '../../constants/FwApplicationContants';
import {
  getSelectedSearchRecord,
  linkNewRecord,
  searchEntityRecords,
  fetchWidget,
  setCouiConfig,
} from '../../api/coui';
import { MFEController } from '../../../../controller';

@Component({
  tag: 'fw-application',
  shadow: true,
})
export class FwApplication {
  @Element() host!: HTMLElement;

  private refDisplayComponent;

  @Prop() applicationName?: string = '';
  @Prop() componentType?: string = '';
  @Prop() componentId?: string = '';
  @Prop() params = null;

  @State() loading = true;

  //   @Watch('params')
  //   watchParamsChangeHandler(): void {
  //     this.boolParamsChanged = true;
  //     this.validateTrigger();
  //   }

  //   @Watch('componentId')
  //   watchComponentIdChangeHandler(): void {
  //     this.boolComponentIdChanged = true;
  //     this.validateTrigger();
  //   }

  @Method()
  async setValues(values) {
    this.refDisplayComponent?.setValues(values);
    this.loading = false;
  }

  //   async validateTrigger() {
  //     if (
  //       this.boolComponentIdChanged &&
  //       this.boolParamsChanged &&
  //       this.storeInstance
  //     ) {
  //       this.boolComponentIdChanged = false;
  //       this.boolParamsChanged = false;
  //       this.loading = true;
  //       this.storeInstance?.registerComponent(
  //         this.componentId,
  //         this,
  //         this.params
  //       );
  //       this.storeInstance?.trigger(this.componentId);
  //     }
  //   }
  @Method()
  async trigger(componentId, params = null) {
    let objResponse;

    const config = MFEController.getApplicationConfig(APP_ID);

    switch (this.applicationName) {
      case FW_APP_CONSTANTS.APP_CUSTOM_OBJECT:
        objResponse = await fetchWidget(
          config,
          params ?? this.params,
          componentId
        );
        this.setValues(objResponse);
        return objResponse;
      default:
        break;
    }
  }

  async componentWillLoad() {
    this.loading = true;
    // this.storeInstance = FwApplicationController.getApplication(
    //   this.applicationName
    // );
    // this.storeInstance?.registerComponent(this.componentId, this, this.params);

    setCouiConfig(MFEController.getApplicationConfig(APP_ID));

    MFEController.namespace(this.componentId).subscribe(
      'appPropsChanged',
      (msg) => {
        (window as any).log(
          `Message received for instance - ${
            this.componentId
          } from app shell appPropsChanged
          <pre>${JSON.stringify(msg, null, 2)}</pre>`
        );
        this.trigger(this.componentId, this.params);
      }
    );
  }

  async componentDidLoad() {
    this.loading = true;
    this.trigger(this.componentId);
  }

  disconnectedCallback(): void {
    // if (this.storeInstance) {
    //   this.storeInstance.deRegisterComponent(this.componentId);
    // }
    this.loading = false;
  }

  private navigateHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();

    MFEController.namespace(APP_ID).publish({
      eventName: FW_APP_CONSTANTS.ACTION_NAVIGATE,
      payload: {
        url: event.detail.route,
        type: 'CTA_PRIMARY_FIELD',
      },
    });

    // FwApplicationController.navigate(FW_APP_CONSTANTS.APP_CUSTOM_OBJECT, {
    //   url: event.detail.route,
    //   type: 'CTA_PRIMARY_FIELD',
    // });
  };

  private viewAllRecordsHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();

    MFEController.namespace(APP_ID).publish({
      eventName: FW_APP_CONSTANTS.ACTION_NAVIGATE,
      payload: {
        url: event.detail.route,
        type: 'CTA_VIEW_ALL_RECORDS',
      },
    });

    // FwApplicationController.navigate(FW_APP_CONSTANTS.APP_CUSTOM_OBJECT, {
    //   url: event.detail.route,
    //   type: 'CTA_VIEW_ALL_RECORDS',
    // });
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
    let template: JSX.Element = null;
    template = (
      <fw-widget-card
        ref={(el) => (this.refDisplayComponent = el)}
        params={this.params}
        loading={this.loading}
        componentId={this.componentId}
        onFwNavigate={this.navigateHandler}
        onFwViewAllRecords={this.viewAllRecordsHandler}
        fetchData={this.fetchDataHandler}
        trigger={this.trigger}
      ></fw-widget-card>
    );

    return template;
  }

  render() {
    return <Host tabIndex='-1'>{this.renderWebComponent()}</Host>;
  }
}
