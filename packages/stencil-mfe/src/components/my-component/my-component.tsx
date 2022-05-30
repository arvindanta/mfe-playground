import { Component, Prop, Host, h, Method } from '@stencil/core';
import { format } from '../../utils/utils';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  /**
   * The first name
   */
  @Prop() first: string;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  @Prop() appProps;

  private getText(): string {
    return format(this.first, this.middle, this.last);
  }

  @Method()
  async trigger(params: any) {
    (window as any).log(
      `Calling trigger in my-compoment <pre>${JSON.stringify(
        params,
        null,
        2
      )}</pre>`
    );
    return { response: { params } };
  }

  render() {
    return (
      <Host>
        <div>Hello, World! I'm {this.getText()}</div>
      </Host>
    );
  }
}
