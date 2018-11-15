import { LitElement, html } from '@polymer/lit-element';

import { onNavigate } from '../../router';

export class Nav extends LitElement {
  static get properties() {
    return {
      activePath: String
    }
  }

  constructor() {
    super();
    this.activePath = window.location.pathname;
  }

  connectedCallback() {
    super.connectedCallback();

    this._unsub = onNavigate(() => this.activePath = window.location.pathname);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsub();
  }

  render() {
    return html`
      <style>
        ::slotted(a[href="${this.activePath.trim()}"]),
        ::slotted(a[href^="${this.activePath.trim() + '/'}"]) {
          color: red;
          font-weight: bold;
        }

        ::slotted(a) {
          text-decoration: none;
          text-transform: uppercase;
        }

        ::slotted(a:not(:first-child)) {
          margin-left: 8px;
        }
      </style>
      <slot></slot>
    `;
  }

  _updateActiveLink() {
    const links = Array.from(this.shadowRoot.querySelectorAll('a[href]'));

    links.forEach(link => {
      if (this._isActive(link.getAttribute('href'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  _isActive(href) {
    const pathname = window.location.pathname;

    if (!pathname.startsWith(href)) {
      return false;
    }

    return pathname.length === href.length || pathname[href.length] === '/';
  }

}

customElements.define('tn-nav', Nav);