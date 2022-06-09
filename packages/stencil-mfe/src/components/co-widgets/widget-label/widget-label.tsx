/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  Component,
  Event,
  Element,
  EventEmitter,
  Prop,
  h,
  Host,
  State,
} from '@stencil/core';

@Component({
  tag: 'fw-widget-label',
  styleUrl: 'widget-label.scss',
  shadow: true,
})
export class WidgetLabel {
  private spanLabel: HTMLElement;
  private resizeObserver;

  @Element() host!: HTMLElement;

  @Prop() label = '';

  @Prop() linkData = '';

  @Prop() type:
    | 'section'
    | 'header'
    | 'label'
    | 'link'
    | 'sublink'
    | 'subtext' = 'header';

  @State() addTooltip = false;

  @Event() fwAnchorClick!: EventEmitter;

  componentDidRender = () => {
    const elLabel = this.spanLabel;
    if (elLabel && !this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        if (!this.addTooltip && elLabel.offsetHeight < elLabel.scrollHeight) {
          this.addTooltip = true;
        }
      });
      this.resizeObserver.observe(elLabel);
    }
  };

  disconnectedCallback(): void {
    this.removeResizeObserver();
  }

  private removeResizeObserver = () => {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  };

  private linkClickHandler = (event: MouseEvent) => {
    if (event) {
      event.stopImmediatePropagation();
      event.stopPropagation();
    }

    this.fwAnchorClick.emit({
      linkData: this.linkData,
    });
  };

  private renderLabel() {
    const strBaseClassName = 'fw-application-widget-label';
    const strLabelClassName = `${strBaseClassName} ${strBaseClassName}--base-label ${strBaseClassName}--${this.type}-label`;

    if (this.type === 'link') {
      return (
        <a
          ref={(el) => (this.spanLabel = el)}
          class={strLabelClassName}
          onClick={this.linkClickHandler}
        >
          {this.label}
        </a>
      );
    } else {
      return (
        <span ref={(el) => (this.spanLabel = el)} class={strLabelClassName}>
          {this.label}
        </span>
      );
    }
  }

  render() {
    return (
      <Host tabIndex='-1'>
        {this.addTooltip && (
          <fw-tooltip trigger='hover' content={this.label}>
            {this.renderLabel()}
          </fw-tooltip>
        )}
        {!this.addTooltip && this.renderLabel()}
      </Host>
    );
  }
}
