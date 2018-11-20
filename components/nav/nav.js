import { LitElement, html } from '@polymer/lit-element';

import { onNavigate } from '../../views/shared/router';
import style from './nav.css';

let index = 0;

export class Nav extends LitElement {
  static get properties() {
    return {
      open: Boolean
    }
  }

  constructor() {
    super();
    this._id = `nav-${index++}`;
  }

  connectedCallback() {
    super.connectedCallback();

    this._links = Array.from(this.querySelectorAll('a'));
    this._updateActiveLinks();

    this._clickOutsideHandler = () => this.open = false;
    document.addEventListener('click', this._clickOutsideHandler);

    // need to wait for the slot to be ready.
    setTimeout(() => this._maxDropdownHeight = this._getMaxDropdownHeight());

    this._unsub = onNavigate(() => this._updateActiveLinks());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._clickOutsideHandler);
    this._unsub();
  }

  render() {
    return html`
      <style>${style}</style>
      <nav>
        <slot class="links"></slot>
        <button class="${this.open ? 'm-open' : ''}"
                @click="${this._toggleButtonHandler}"
                aria-controls="${this._id}"
                aria-expanded=${this.open}>
          <svg viewBox="0 0 24 24" class="valign-middle absolute sb-navbar-icon" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" style="width: 24px; height: 24px;"><path d="M21,12.9H3c-0.5,0-0.9-0.4-0.9-0.9s0.4-0.9,0.9-0.9h18c0.5,0,0.9,0.4,0.9,0.9S21.5,12.9,21,12.9z"></path><path d="M21,6.9H3C2.5,6.9,2.1,6.5,2.1,6S2.5,5.1,3,5.1h18c0.5,0,0.9,0.4,0.9,0.9S21.5,6.9,21,6.9z"></path><path d="M21,18.9H3c-0.5,0-0.9-0.4-0.9-0.9s0.4-0.9,0.9-0.9h18c0.5,0,0.9,0.4,0.9,0.9S21.5,18.9,21,18.9z"></path></svg>
        </button>
        <div id="${this._id}"
             class="dropdown ${this.open ? 'm-open' : ''}"
             style="max-height: ${this._maxDropdownHeight}px"
             ?aria-hidden=${!this.open}>
          <slot class="dropdown-slot" name="dropdown"></slot>
        </div>
      </nav>
    `;
  }

  toggle() {
    this.open = !this.open;
  }

  _updateActiveLinks() {
    this._links.forEach(link => {
      if (this._isActive(link.getAttribute('href'))) {
        link.classList.add('m-active');
      } else {
        link.classList.remove('m-active');
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

  _getMaxDropdownHeight() {
    const slot = this.shadowRoot.querySelector('.dropdown-slot');
    return Array.from(slot.assignedNodes())
      .reduce((total, node) => total + node.getBoundingClientRect().height, 0);
  }
  
  _toggleButtonHandler(event) {
    event.stopPropagation();
    this.toggle();
  }
}

customElements.define('tn-nav', Nav);