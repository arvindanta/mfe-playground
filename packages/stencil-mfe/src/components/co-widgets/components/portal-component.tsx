/* eslint-disable no-console */
import { Component, h, Host, Prop, State } from '@stencil/core';

@Component({
  tag: 'fw-portal-component',
  shadow: true,
})
export class PortalComponent {
  @Prop() portalId = 'portal';
  @Prop() zIndex = '9005';

  @State() opacity = '0';

  private moved = false;
  private portal: HTMLElement;
  private element: HTMLElement;

  private createPortal() {
    this.portal = document.createElement('div');
    this.portal.setAttribute('id', this.portalId);
    this.portal.style.zIndex = this.zIndex;
    this.portal.style.position = 'absolute';
    document.body.append(this.portal);
  }

  private moveElementToPortal() {
    this.portal.appendChild(this.element);
  }

  componentWillLoad() {
    this.createPortal();
  }

  componentDidLoad() {
    this.moveElementToPortal();
    setTimeout(() => {
      this.opacity = '1';
    }, 0);
  }

  disconnectedCallback() {
    try {
      if (this.moved) {
        this.portal.remove();
        this.portal = null;
      }
      this.moved = true;
    } catch (error) {
      console.log('Error removing portal - ' + error);
    }
  }

  render() {
    return (
      <Host ref={(el) => (this.element = el)} style={{ opacity: this.opacity }}>
        <slot />
      </Host>
    );
  }
}
