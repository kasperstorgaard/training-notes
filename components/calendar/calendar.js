import {LitElement, html} from '@polymer/lit-element';
import format from 'date-fns/format'

import style from './calendar.css';

const millisPerDay = 1000 * 60 * 60 * 24;
const viewportHeight = 100000;

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
    this._buffers = Array.from(this.shadowRoot.querySelectorAll('.buffer'));

    this._viewport.style.marginBottom = viewportHeight / 2;
    this._viewport.scrollTop = viewportHeight / 2;

    const options = {
      root: this._viewport,
      threshold: [0, 1]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          this._swapBuffers(entry);
        }
      });
    }, options);

    this._buffers.forEach(buffer => observer.observe(buffer));
  }

  render() {
    return html`
      <style>${style}</style>
      <h2 class="month-year">${format(this.date, 'MMMM YYYY')}</h2>
      <div class="viewport">
        <div class="scroller">
          <div class="buffer">
            <ul class="days">
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
          </div>
          <div class="buffer">
            <ul class="days">
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
          </div>
        </div>
      </div>
    `;
  }

  _swapBuffers(entry) {
    const prevFirstOrder = this._buffers[0].style.order;
    const prevLastOrder = this._buffers[1].style.order;
    this._buffers[0].style.order = prevLastOrder !== '' ? prevLastOrder : 0;
    this._buffers[1].style.order = prevFirstOrder !== '' ? prevFirstOrder : 1;

    if (entry.boundingClientRect.y > 0) {
      // const top = this._viewport.scrollTop;
      // this._viewport.scrollTop = top + entry.boundingClientRect.height;
    }
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
