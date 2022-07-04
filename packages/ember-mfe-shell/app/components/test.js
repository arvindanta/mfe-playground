/* eslint-disable ember/no-empty-glimmer-component-classes */
import Component from '@glimmer/component';

export default class Test extends Component {
  get appProps() {
    return { routerBasePath: '/mfe1' };
  }
  handleClick(e) {
    console.log('ebet ', e);
  }
  handleClick1(e) {
    console.log('sht ', e);
  }
}
