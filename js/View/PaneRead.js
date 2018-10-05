'use strict';

import {
  hide,
  show
} from '../util.js';

class PaneRead {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  getElements() {
    let pane = document.querySelector('.pane-read');

    this.read = pane.querySelector('.page-read');
  }

  initialize() {
    this.getElements();
    this.subscribe();
  }

  paneHide() {
    this.bus.publish('page.read.hide', null);
  }

  paneShow() {
    this.bus.publish('page.read.show', null);
  }

  readHide() {
    hide(this.read);
  }

  readShow() {
    show(this.read);
  }

  subscribe() {
    this.bus.subscribe('page.read.show',
      () => {
        this.readShow();
      }
    );
    this.bus.subscribe('page.read.hide',
      () => {
        this.readHide();
      }
    );
    this.bus.subscribe('pane.read.hide',
      () => {
        this.paneHide();
      }
    );
    this.bus.subscribe('pane.read.show',
      () => {
        this.paneShow();
      }
    );
  }

}

export {
  PaneRead
};
