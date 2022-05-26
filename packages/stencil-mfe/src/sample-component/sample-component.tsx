import { Component, State, h, Method } from '@stencil/core';
import '@freshworks/crayons/dist/components/fw-button';

@Component({
  tag: 'fw-sample1',
  shadow: false,
})
export class Sample {
  @State() showCard = true;

  handleClick = (): void => {
    console.info('Hello');
    this.showCard = !this.showCard;
  };

  @Method()
  async trigger(params: any) {
    (window as any).log(
      `Calling trigger in sample-compoment <pre>${JSON.stringify(
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
      </div>
    );
  }
}
