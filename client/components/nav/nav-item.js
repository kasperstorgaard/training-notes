import { LitElement, html } from '@polymer/lit-element';
import { classMap } from 'lit-html/directives/classMap';

export class NavItem extends LitElement {
  static get properties() {
    return {
      url: String
    };
  }
  
  render() {
    const classes = { active: false };

    return html`
      <a href="${this.url}" class="${classMap(classes)}">
        <slot></slot
      </a>
    `;
  }
}

customElements.define('tn-nav-item', NavItem);