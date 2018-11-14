import { LitElement, html } from '@polymer/lit-element';

import style from './calendar.css';

export class Calendar extends LitElement {
  static get properties() {
    return {};
  }

  render() {
    return html`
      <style>${style}</style>
      calendar component
    `;
  }
}

customElements.define('tn-calendar', Calendar);