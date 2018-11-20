import {LitElement, html} from '@polymer/lit-element';
import format from 'date-fns/format'

import style from './calendar.css';

const dummyData = [{
  date: new Date(2019, 0, 2),
  notes: [
    'Probably should get started right in the new year, ugh.',
    'Focus on chinup form.'
  ].join('\n')
}];

export class Calendar extends LitElement {
  static get properties() {
    return {
      date: String,
      type: String
    };
  }

  constructor() {
    super();
    this.date = this.date || new Date(Date.now());
  }

  render() {
    return html`
      <style>${style}</style>
      <h2 class="month-year">${format(this.date, 'MMMM YYYY')}</h2>
      ${this._renderDayView(dummyData)}
    `;
  }

  _renderDayView(days) {
    return html`
      <ul class="days">
        ${days.map(day => this._renderDay(day))}
      </ul>
    `;
  }

  _renderDay(day) {
    return html`
      <li class="day">
        <div class="day-data">
          <span class="day-number">${format(day.date, 'D')}</span>
          <span class="day-weekday">${format(day.date, 'ddd')}</span>
        </div>
        <p>${day.notes || ''}</p>
      </li>
    `;
  }

  _renderWeek() {}
  _renderMonth() {}
}

customElements.define('tn-calendar', Calendar);