import { Component, Prop, Host, h, Method, Event } from '@stencil/core';
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

  @Prop() handleSendMess;

  @Event() submitForm;

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

  sendEvent = () => {
    this.submitForm.emit();
  };

  render() {
    return (
      <Host>
        <div>Hello, World! I'm {this.getText()}</div>
        <br />
        <fw-button onClick={this.handleSendMess}>
          send message from inner child
        </fw-button>

        <fw-button onClick={this.sendEvent}>
          send message from inner child via events
        </fw-button>
      </Host>
    );
  }
}
