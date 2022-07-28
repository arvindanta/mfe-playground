/* eslint-disable ember/no-empty-glimmer-component-classes */
import Component from '@glimmer/component';
import { MFEController } from '../controller';

export default class Test extends Component {
  constructor() {
    super(...arguments);
    MFEController.namespace('mfe1').subscribe('from_child_react', (msg) => {
      window.log(
        `Message received from MFE <pre>${JSON.stringify(msg, null, 2)}</pre>`,
        true
      );
    });
  }

  get appProps() {
    return { routerBasePath: '/mfe1' };
  }
  handleClick(e) {
    console.log('ebet ', e);
    window.log('sending message to MFE reactMFE1 from App Shell', true);

    MFEController.namespace('mfe1').publish({
      eventName: 'from_app_shell',
      action: {
        type: 'from_app_shell',
        sender: 'app shell',
      },
      payload: 'from app shell',
    });
  }
  handleClick1(e) {
    console.log('sht ', e);
    window.log('sending message to MFE reactMFE1 from App Shell', true);

    MFEController.namespace('mfe1').publish({
      eventName: 'from_app_shell',
      action: {
        type: 'from_app_shell',
        sender: 'app shell',
      },
      payload: 'from app shell',
    });
  }
}
