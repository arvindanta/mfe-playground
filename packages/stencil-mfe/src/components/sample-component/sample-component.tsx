import {
  Element,
  Component,
  State,
  h,
  Method,
  Prop,
  Listen,
} from '@stencil/core';

// plain import works because stencil components inside stencil project is auto identified and defined as custom elements.
import '@freshworks/crayons/dist/components/fw-button';
// for non stencil projects we need to import every component being used.
// Can ignore dependent components as they will be defined when parent's defineCustomElement is called
// import { defineCustomElement} from '@freshworks/crayons/dist/components/fw-button';
// defineCustomElement();

import { MFEController } from '../../controller';

@Component({
  tag: 'fw-sample1',
  shadow: false,
})
export class Sample {
  @Element() el;
  @State() showCard = true;
  @State() state = '';

  @Prop() appProps;

  componentWillLoad() {
    MFEController.namespace(this.appProps.instanceId).subscribe(
      'from_app_shell',
      (msg) => {
        (window as any).log(
          `msg from outside for ${
            this.appProps.instanceId
          } is <pre>${JSON.stringify(msg, null, 2)}</pre>`
        );

        this.state = JSON.stringify(msg);
      }
    );
  }

  @Listen('submitForm')
  handleEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    (window as any).log(`emitting event`);
    this.handleSendMess();
  }

  handleClick = (): void => {
    console.info('handle click');
    this.showCard = !this.showCard;
  };

  handleSendMess = () => {
    (window as any).log(
      'publishing event from_child_stencil_webc from stencil webc'
    );
    MFEController.namespace(this.appProps.instanceId).publish({
      eventName: 'from_child_stencil_webc',
      action: {
        type: 'from_child stencilwebc',
        sender: 'stencilMFE1',
      },
      payload: 'from child stencilMFE1',
      targetOrigin: this.appProps.shellUrl,
    });
  };

  handleSendCbMess = () => {
    (window as any).log(
      'publishing event  - from_child_stencil_webc_api from stencil webc'
    );
    MFEController.namespace(this.appProps.instanceId).publish({
      eventName: 'from_child_stencil_webc_api',
      action: {
        type: 'from_child stencil webc api',
        sender: 'stencilMFE1',
      },
      payload: {
        params: { id: 1 },
        cb: (res) => {
          (window as any).log(
            `Response from parent <pre>${JSON.stringify(res, null, 2)}</pre>`
          );
        },
      },
      targetOrigin: this.appProps.shellUrl,
    });
  };

  handleSendRouteMess = () => {
    (window as any).log('sending route change message event from stencilMFE1');
    MFEController.namespace(this.appProps.instanceId).publish({
      eventName: 'route_change',
      action: {
        type: 'navigate',
        sender: 'stencilMFE1',
      },
      payload: {
        from: window.origin,
        to: '/mfe1/routing',
      },
      targetOrigin: this.appProps.shellUrl,
    });
  };

  @Method()
  async trigger(params: any) {
    (window as any).log(
      `Calling trigger in sample-component <pre>${JSON.stringify(
        params,
        null,
        2
      )}</pre>`
    );
    return { response: { params } };
  }

  render(): JSX.Element {
    return (
      <div>
        <fw-button onFwClick={this.handleClick}>Toogle Card</fw-button>
        <fw-button modal-trigger-id='welcome'> Open Modal </fw-button>
        <fw-modal id='welcome' title-text='Welcome'>
          This is a sample modal dialog
        </fw-modal>
        {this.showCard && (
          <div class='fw-card-1 fw-p-24 fw-flex fw-flex-row'>
            <div class='fw-flex-grow'>
              <div class='fw-type-h5'>Arabic</div>
              <div class='fw-type-xs'>Last updated - 25 June 2020</div>
            </div>
            <div class='fw-flex-grow-0'>
              <fw-button color='secondary' class='fw-type-h6'>
                {' '}
                Download existing{' '}
              </fw-button>
              <fw-button color='secondary' class='fw-type-h6 fw-ml-8'>
                {' '}
                Update file{' '}
              </fw-button>
            </div>
            <div class='fw-flex-grow-0'>
              <fw-button
                size='icon'
                color='text'
                role='button'
                class='fw-ml-12'
              >
                <fw-icon name='delete'></fw-icon>
              </fw-button>
            </div>
          </div>
        )}
        <fw-button onClick={this.handleSendMess}>
          Send Message to App Shell
        </fw-button>
        <br />
        <br />
        <fw-button onClick={this.handleSendRouteMess}>
          Send Message to App Shell to change route
        </fw-button>
        <br />
        <br />
        <fw-button onClick={this.handleSendCbMess}>
          Send Message to App Shell with callback
        </fw-button>

        <hr />
        <hr />
        <my-component first={this.state} handleSendMess={this.handleSendMess} />
      </div>
    );
  }
}
