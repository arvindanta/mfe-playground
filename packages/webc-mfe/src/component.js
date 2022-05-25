import { MFEInstance } from './controller';

const template = document.createElement('template');
template.innerHTML = `
       <h1>This is a web component rendered as a MFE</h1>
        <button id="x">Send Message to App Shell</button>
        <br/><br/>
        <button id="y">Send Message to App Shell to change route</button>
`;

class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    MFEInstance?.subscribe?.('from_app_shell', (msg) => {
      window.log(
        `msg from outside for is <pre>${JSON.stringify(msg, null, 2)}</pre>`
      );
    });

    const sendMess = this.shadowRoot.querySelector('button#x');
    const sendRouteMess = this.shadowRoot.querySelector('button#y');

    sendMess.addEventListener('click', this.handleSendMess);
    sendRouteMess.addEventListener('click', this.handleSendRouteMess);
  }

  handleSendMess() {
    window.log('publishing event 1 - from_child_webc from webc');
    MFEInstance?.publish?.({
      eventName: 'from_child_webc',
      action: {
        type: 'from_child webc',
        sender: 'webcMFE1',
      },
      payload: 'from child webcMFE1',
      targetOrigin: this.appProps?.shellUrl,
    });
  }

  handleSendRouteMess() {
    window.log('sending route change message event from webcMFE1');
    MFEInstance?.publish?.({
      eventName: 'route_change',
      action: {
        type: 'navigate',
        sender: 'webcMFE1',
      },
      payload: {
        from: window.origin,
        to: '/mfe1/communication',
      },
      targetOrigin: this.appProps?.shellUrl,
    });
  }

  trigger(params) {
    window.log(
      `Trigger called in web component from wrapper with <pre>${JSON.stringify(
        params,
        null,
        2
      )}</pre>`
    );
  }
}
export { MyComponent };
