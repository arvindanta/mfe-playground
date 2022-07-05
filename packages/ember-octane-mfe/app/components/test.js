import Component from '@glimmer/component';

import { action } from '@ember/object';
import { MFEInstance, shellUrl } from '../controller';

export default class TestComponent extends Component {
  @action
  mfeToShell(e) {
    console.log('event', e);
    window.log('sending message to App Shell from MFE emberMFE1');

    MFEInstance.publish({
      eventName: 'from_child_ember',
      action: {
        type: 'from_child emberMFE1',
        sender: 'emberMFE1',
      },
      payload: 'from child emberMFE1',
      shellUrl,
    });
  }
  @action
  mfeToShellRouting(route) {
    window.log('sending message for routing to App Shell from MFE emberMFE1');

    MFEInstance.publish({
      eventName: 'route_change',
      action: {
        type: 'from_child emberMFE1',
        sender: 'emberMFE1',
      },
      payload: { from: window.location.pathname, to: route },
      shellUrl,
    });
  }
}
