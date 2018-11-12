import { LitElement, html } from '@polymer/lit-element';

export class Calendar extends LitElement {
  static get properties() {
    return {};
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('hey from calendar!');
  }

  render() {
    return html`
      calendar component
    `;
  }
}

customElements.define('tn-calendar', Calendar);