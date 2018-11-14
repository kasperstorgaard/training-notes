import { LitElement, html } from '@polymer/lit-element';

import style from './nav-item.css';
import { onNavigate } from '../../router';

export class NavItem extends LitElement {
  static get properties() {
    return {
      url: String,
      active: {
        type: Boolean,
        reflect: true
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsub = onNavigate(() => this.active = this._isActive());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsub();
  }

  render() {
    return html`
      <style>${style}</style>
      <a href="${this.url}"><slot></slot</a>
    `;
  }

  _isActive() {
    const pathname = window.location.pathname;

    if (!pathname.startsWith(this.url)) {
      return false;
    }

    return pathname.length === this.url.length ||
      pathname[this.url.length] === '/';
  }

}

customElements.define('tn-nav-item', NavItem);