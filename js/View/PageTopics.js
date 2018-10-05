'use strict';

import {
} from '../util.js';

class PageTopics {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  addListeners() {
    this.nav.addEventListener('click',
      (event) => {
        this.navClick(event);
      }
    );
    this.list.addEventListener('click',
      (event) => {
        this.listClick(event);
      }
    );
  }

  getElements() {
    let pane = document.querySelector('.pane-help');
    this.page = pane.querySelector('.page-topics');

    this.nav = this.page.querySelector('.nav-topics');
    this.scroll = this.page.querySelector('.scroll-topics');
    this.tools = this.page.querySelector('.tools-topics');

    this.list = this.scroll.querySelector('.list');

    this.banner = this.tools.querySelector('.banner-topics');

    this.btnBack = this.nav.querySelector('.btn-back');
  }

  initialize() {
    this.getElements();
    this.addListeners();
  }

  listClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target.classList.contains('btn-topic')) {
      let topic = target.textContent;
      if (topic === 'That\'s MY KING!') {
        topic = 'ThatsMyKING';
      }
      this.bus.publish('page.topics.topic.click', topic);
      return;
    }
  }

  navClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      this.bus.publish('page.topics.back.click', null);
    }
  }

}

export {
  PageTopics
};
