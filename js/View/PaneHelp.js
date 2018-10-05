'use strict';

import {
  hide,
  show
} from '../util.js';

class PaneHelp {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  getElements() {
    let pane = document.querySelector('.pane-help');

    this.help = pane.querySelector('.page-help');
    this.settings = pane.querySelector('.page-settings');
    this.topics = pane.querySelector('.page-topics');
  }

  helpHide() {
    hide(this.help);
  }

  helpShow() {
    show(this.help);
  }

  initialize() {
    this.getElements();
    this.subscribe();
  }

  paneHide() {
    this.bus.publish('page.help.hide', null);
    this.bus.publish('page.settings.hide', null);
    this.bus.publish('page.topics.hide', null);
  }

  paneShow() {
    this.bus.publish('page.help.show', null);
  }

  settingsHide() {
    hide(this.settings);
  }

  settingsShow() {
    show(this.settings);
  }

  subscribe() {
    this.bus.subscribe('page.help.show',
      () => {
        this.helpShow();
      }
    );
    this.bus.subscribe('page.help.hide',
      () => {
        this.helpHide();
      }
    );
    this.bus.subscribe('page.settings.show',
      () => {
        this.settingsShow();
      }
    );
    this.bus.subscribe('page.settings.hide',
      () => {
        this.settingsHide();
      }
    );
    this.bus.subscribe('page.topics.hide',
      () => {
        this.topicsHide();
      }
    );
    this.bus.subscribe('page.topics.show',
      () => {
        this.topicsShow();
      }
    );
    this.bus.subscribe('pane.help.hide',
      () => {
        this.paneHide();
      }
    );
    this.bus.subscribe('pane.help.show',
      () => {
        this.paneShow();
      }
    );
  }

  topicsHide() {
    hide(this.topics);
  }

  topicsShow() {
    show(this.topics);
  }

}

export {
  PaneHelp
};
