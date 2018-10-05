'use strict';

import {
  hide,
  show
} from '../util.js';

class PaneSearch {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  filtersHide() {
    hide(this.filters);
  }

  filtersShow() {
    show(this.filters);
  }

  getElements() {
    let pane = document.querySelector('.pane-search');

    this.results = pane.querySelector('.page-results');
    this.filters = pane.querySelector('.page-filters');
    this.history = pane.querySelector('.page-history');
  }

  historyHide() {
    hide(this.history);
  }

  historyShow() {
    show(this.history);
  }

  initialize() {
    this.getElements();
    this.subscribe();
  }

  paneHide() {
    this.bus.publish('page.results.hide', null);
    this.bus.publish('page.filters.hide', null);
    this.bus.publish('page.history.hide', null);
  }

  paneShow() {
    this.bus.publish('page.results.show', null);
  }

  resultsHide() {
    hide(this.results);
  }

  resultsShow() {
    show(this.results);
  }

  subscribe() {
    this.bus.subscribe('page.filters.hide',
      () => {
        this.filtersHide();
      }
    );
    this.bus.subscribe('page.filters.show',
      () => {
        this.filtersShow();
      }
    );
    this.bus.subscribe('page.history.hide',
      () => {
        this.historyHide();
      }
    );
    this.bus.subscribe('page.history.show',
      () => {
        this.historyShow();
      }
    );
    this.bus.subscribe('page.results.hide',
      () => {
        this.resultsHide();
      }
    );
    this.bus.subscribe('page.results.show',
      () => {
        this.resultsShow();
      }
    );
    this.bus.subscribe('pane.search.hide',
      () => {
        this.paneHide();
      }
    );
    this.bus.subscribe('pane.search.show',
      () => {
        this.paneShow();
      }
    );
  }

}

export {
  PaneSearch
};
