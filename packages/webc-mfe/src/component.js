import { MFEController } from './controller';

const template = document.createElement('template');
template.innerHTML = `
       <h1>This is a web component rendered as a MFE</h1>
        <button id="x">Send Message to App Shell</button>
        <br/><br/>
        <button id="y">Send Message to App Shell to change route</button>
        <br/><br/>
        <button id="z">Send Message to App Shell with callback</button>
`;

class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const sendMess = this.shadowRoot.querySelector('button#x');
    const sendRouteMess = this.shadowRoot.querySelector('button#y');
    const sendCbMess = this.shadowRoot.querySelector('button#z');
    sendMess.addEventListener('click', this.handleSendMess.bind(this));
    sendRouteMess.addEventListener(
      'click',
      this.handleSendRouteMess.bind(this)
    );
    sendCbMess.addEventListener('click', this.handleSendCbMess.bind(this));
    console.info('appProps1', this.appProps);
  }

  connectedCallback() {
    console.info('appProps', this.appProps);
    MFEController.namespace(this.appProps.instanceId).subscribe(
      'from_app_shell',
      (msg) => {
        window.log(
          `msg from outside for is <pre>${JSON.stringify(msg, null, 2)}</pre>`
        );
      }
    );
  }

  handleSendMess() {
    window.log('publishing event from_child_webc from webc');
    MFEController.namespace(this.appProps.instanceId).publish({
      eventName: 'from_child_webc',
      action: {
        type: 'from_child webc',
        sender: 'webcMFE1',
      },
      payload: 'from child webcMFE1',
      targetOrigin: this.appProps.shellUrl,
    });
  }

  handleSendCbMess() {
    window.log('publishing event  - from_child_webc_api from webc');
    MFEController.namespace(this.appProps.instanceId).publish({
      eventName: 'from_child_webc_api',
      action: {
        type: 'from_child webc api',
        sender: 'webcMFE1',
      },
      payload: {
        params: { id: 1 },
        cb: (res) => {
          window.log(
            `Response from parent <pre>${JSON.stringify(res, null, 2)}</pre>`
          );
        },
      },
      targetOrigin: this.appProps.shellUrl,
    });
  }

  handleSendRouteMess() {
    window.log('sending route change message event from webcMFE1');
    MFEController.namespace(this.appProps.instanceId).publish({
      eventName: 'route_change',
      action: {
        type: 'navigate',
        sender: 'webcMFE1',
      },
      payload: {
        from: window.origin,
        to: '/mfe1/communication',
      },
      targetOrigin: this.appProps.shellUrl,
    });
  }

  async trigger(params) {
    window.log(
      `Trigger called in web component from wrapper with <pre>${JSON.stringify(
        params,
        null,
        2
      )}</pre>`
    );
    return { response: { params } };
  }
}
export { MyComponent };
