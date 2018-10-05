'use strict';

import {
  hide,
  show
} from '../util.js';

class PaneContents {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  contentsHide() {
    hide(this.contents);
  }

  contentsShow() {
    show(this.contents);
  }

  getElements() {
    let pane = document.querySelector('.pane-contents');

    this.contents = pane.querySelector('.page-contents');
    this.tomes = pane.querySelector('.page-tomes');
  }

  initialize() {
    this.getElements();
    this.subscribe();
  }

  paneHide() {
    this.bus.publish('page.contents.hide', null);
    this.bus.publish('page.tomes.hide', null);
  }

  paneShow() {
    this.bus.publish('page.contents.show', null);
  }

  subscribe() {
    this.bus.subscribe('page.contents.hide',
      () => {
        this.contentsHide();
      }
    );
    this.bus.subscribe('page.contents.show',
      () => {
        this.contentsShow();
      }
    );
    this.bus.subscribe('page.tomes.hide',
      () => {
        this.tomesHide();
      }
    );
    this.bus.subscribe('page.tomes.show',
      () => {
        this.tomesShow();
      }
    );
    this.bus.subscribe('pane.contents.hide',
      () => {
        this.paneHide();
      }
    );
    this.bus.subscribe('pane.contents.show',
      () => {
        this.paneShow();
      }
    );
  }

  tomesHide() {
    hide(this.tomes);
  }

  tomesShow() {
    show(this.tomes);
  }

}

export {
  PaneContents
};
