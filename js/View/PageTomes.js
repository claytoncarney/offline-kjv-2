'use strict';

import {
} from '../util.js';

class PageTomes {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  addListeners() {
    this.list.addEventListener('click',
      (event) => {
        this.listClick(event);
      }
    );
    this.nav.addEventListener('click',
      (event) => {
        this.navClick(event);
      }
    );
  }

  getElements() {
    let pane = document.querySelector('.pane-contents');
    this.page = pane.querySelector('.page-tomes');

    this.scroll = this.page.querySelector('.scroll-tomes');
    this.nav = this.page.querySelector('.nav-tomes');

    this.list = this.scroll.querySelector('.list');

    this.btnBack = this.nav.querySelector('.btn-back');
  }

  initialize() {
    this.getElements();
    this.addListeners();
  }

  listClick(event) {
    event.preventDefault();
    let target = event.target;
    let tomeName = target.getAttribute('data-tome-name');
    this.bus.publish('page.tomes.select.click', tomeName);
  }

  navClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      this.bus.publish('page.tomes.back.click', null);
    }
  }

}

export {
  PageTomes
};
