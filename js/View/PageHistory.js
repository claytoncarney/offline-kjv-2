'use strict';

import {
  deactivate,
  hide,
  removeAllChildren,
  show
} from '../util.js';

class PageHistory {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  actionMenuClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    let entry = this.activeEntry.querySelector('.btn-history-entry');
    let searchStr = entry.textContent;
    switch (target.classList.value) {
      case 'btn-up':
        this.up(searchStr);
        break;
      case 'btn-down':
        this.down(searchStr);
        break;
      case 'btn-delete':
        this.delete(searchStr);
        break;
      case 'btn-cancel':
        deactivate(this.activeEntry);
        break;
    }
    hide(this.actionMenu);
  }

  addListeners() {
    this.actionMenu.addEventListener('click',
      (event) => {
        this.actionMenuClick(event);
      }
    );
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

  btnMenuClick(target) {
    this.showActionMenu(target);
  }

  buildBtnMenu() {
    let span = document.createElement('span');
    span.classList.add('glyph');
    let btnMenu = document.createElement('button');
    btnMenu.classList.add('btn-menu');
    btnMenu.setAttribute('aria-label', 'Menu');
    btnMenu.appendChild(span);
    return btnMenu;
  }

  buildEntry(searchStr) {
    let entry = document.createElement('div');
    entry.classList.add('entry-history');
    let btnEntry = document.createElement('button');
    btnEntry.classList.add('btn-history-entry');
    btnEntry.textContent = searchStr;
    let btnMenu = this.buildBtnMenu();
    entry.appendChild(btnEntry);
    entry.appendChild(btnMenu);
    return entry;
  }

  delete(searchStr) {
    this.bus.publish('page.history.delete.click', searchStr);
  }

  down(searchStr) {
    this.bus.publish('page.history.down.click', searchStr);
  }

  getElements() {
    let pane = document.querySelector('.pane-search');
    this.page = pane.querySelector('.page-history');

    this.scroll = this.page.querySelector('.scroll-history');
    this.tools = this.page.querySelector('.tools-history');
    this.nav = this.page.querySelector('.nav-history');

    this.empty = this.scroll.querySelector('.empty');
    this.list = this.scroll.querySelector('.list');
    this.actionMenu = this.scroll.querySelector('.action-menu');

    this.banner = this.tools.querySelector('.banner-filters');

    this.btnBack = this.nav.querySelector('.btn-back');
  }

  historyHide() {
    hide(this.actionMenu);
  }

  historyShow() {
    if (this.scrollReset) {
      this.scroll.scrollTop = 0;
      this.scrollReset = false;
    }
  }

  historyUpdate(searchHistory) {
    this.searchHistory = searchHistory;
    this.updateList();
  }

  initialize() {
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  listClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target.classList.contains('btn-history-entry')) {
      let searchStr = target.textContent;
      this.bus.publish('page.history.select.click', searchStr);
      return;
    }
    if (target.classList.contains('btn-menu')) {
      let entry = target.previousSibling;
      this.btnMenuClick(entry);
      return;
    }
  }

  navClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      this.bus.publish('page.history.back.click', null);
    }
  }

  scrollToTop() {
    if (this.page.classList.contains('hide')) {
      this.scrollReset = true;
      return;
    }
    this.scroll.scrollTop = 0;
  }

  showActionMenu(target) {
    this.activeEntry = target.closest('div');
    let top = target.offsetTop;
    this.actionMenu.style.top = `${top}px`;
    show(this.actionMenu);
  }

  subscribe() {
    this.bus.subscribe('page.history.hide',
      () => {
        this.historyHide();
      }
    );
    this.bus.subscribe('page.history.scroll.to.top',
      () => {
        this.scrollToTop();
      }
    );
    this.bus.subscribe('page.history.show',
      () => {
        this.historyShow();
      }
    );
    this.bus.subscribe('page.history.update',
      (searchHistory) => {
        this.historyUpdate(searchHistory);
      }
    );
    this.bus.subscribe('tome.update',
      (tome) => {
        this.tomeUpdate(tome);
      }
    );
  }

  tomeUpdate(tome) {
    this.tome = tome;
  }

  up(searchStr) {
    this.bus.publish('page.history.up.click', searchStr);
  }

  updateList() {
    removeAllChildren(this.list);
    if (this.searchHistory.length === 0) {
      show(this.empty);
      return;
    } else {
      hide(this.empty);
    }
    let fragment = document.createDocumentFragment();
    this.searchHistory.forEach((searchStr) => {
      let entry = this.buildEntry(searchStr);
      fragment.appendChild(entry);
    });
    this.list.appendChild(fragment);
  }

}

export {
  PageHistory
};
