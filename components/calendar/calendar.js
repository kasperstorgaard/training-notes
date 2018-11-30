import {LitElement, html} from '@polymer/lit-element';
import format from 'date-fns/format'

import style from './calendar.css';

const millisPerDay = 1000 * 60 * 60 * 24;
let idx = 0;

export class Calendar extends LitElement {
  static get properties() {
    return {
      date: String,
      days: Array,
      type: String
    };
  }

  constructor() {
    super();
    this.date = this.date || new Date(Date.now());
    const data = dummyData();

    const startDate = new Date(data[0].date.getTime() - 10 * millisPerDay);
    const endDate = new Date(data[data.length - 1].date.getTime() + 10 * millisPerDay);
    this.days = this._createRange(startDate, endDate, data);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated() {
    super.firstUpdated();

    this._viewport = this.shadowRoot.querySelector('.viewport');
    this._scroller = this.shadowRoot.querySelector('.scroller');

    this._swapBuffers = Array.from(this.shadowRoot.querySelectorAll('.swap-buffer'));
    this._distBuffers = Array.from(this.shadowRoot.querySelectorAll('.dist-buffer'));

    this._viewport.scrollTop = (this._scroller.getBoundingClientRect().height) / 2;

    const options = {
      root: this._viewport,
      threshold: [0]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('swap');
          this._swap(entry);
        }
      });
    }, options);

    this._distBuffers.forEach(buffer => observer.observe(buffer));
  }

  render() {
    return html`
      <style>${style}</style>
      <h2 class="month-year">${format(this.date, 'MMMM YYYY')}</h2>
      <div class="viewport">
        <div class="scroller">
          <div class="dist-buffer m-start"></div>
          <ul class="days swap-buffer">
            ${this.days.slice(0, this.days.length / 2).map(day => html`
              <li class="day">
                <div class="day-data">
                  <span class="day-weekday">${format(day.date, 'ddd')}</span>
                  <span class="day-number">${format(day.date, 'D')}</span>
                </div>
                <p class="notes">${day.notes || ''}</p>
              </li>
            `)}
          </ul>
          <ul class="days swap-buffer">
            ${this.days.slice(this.days.length / 2).map(day => html`
              <li class="day">
                <div class="day-data">
                  <span class="day-weekday">${format(day.date, 'ddd')}</span>
                  <span class="day-number">${format(day.date, 'D')}</span>
                </div>
                <p class="notes">${day.notes || ''}</p>
              </li>
            `)}
          </ul>
          <div class="dist-buffer m-end"></div>
        </div>
      </div>
    `;
  }

  _swap() {
    const prevOrders = [
      this._swapBuffers[0].style.order,
      this._swapBuffers[1].style.order
    ];

    const viewportHeight = this._scroller.getBoundingClientRect().height;

    this._swapBuffers[0].style.order = prevOrders[1] !== '' ? prevOrders[1] : 0;
    this._swapBuffers[1].style.order = prevOrders[0] !== '' ? prevOrders[0] : 1;

    this._viewport.scrollTop = viewportHeight / 2;
    console.log(idx++, viewportHeight / 2, this._viewport.scrollTop);
  }

  _createRange(startDate, endDate, data = []) {
    const existing = data.slice();
    const output = [];

    let date = startDate;
    let model = existing.shift();

    while (date <= endDate) {
      if (!model || date < model.date) {
        output.push({date})
      } else {
        output.push(model);
        model = existing.shift();
      }

      date = new Date(date.getTime() + millisPerDay);
    }

    return output;
  }
}

customElements.define('tn-calendar', Calendar);

function dummyData() {
    return [{
      date: new Date(2018, 9, 14),
      notes: [
        'Solid workout, x5 slow excentric chinup.',
      ].join('\n')
    }, {
      date: new Date(2019, 0, 2),
      notes: [
        'Probably should get started right in the new year, ugh.',
        'Focus on chinup form.'
      ].join('\n')
    }];
}
