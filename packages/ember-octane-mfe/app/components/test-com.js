import Component from '@glimmer/component';
import { action } from '@ember/object';
import { MFEInstance, shellUrl } from '../controller';

export default class TestComComponent extends Component {
  @action
  handleClick() {
    window.log('sending message to App Shell from MFE reactMFE1');

    MFEInstance.publish({
      eventName: 'from_child_react',
      action: {
        type: 'from_child reactMFE1',
        sender: 'reactMFE1',
      },
      payload: 'from child reactMFE1',
      shellUrl,
    });
  }
}
