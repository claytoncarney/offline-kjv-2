'use strict';

import {
  hide,
  removeAllChildren,
  show
} from '../util.js';

class PageFolders {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  actionMenuClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    let entry = this.activeEntry.querySelector('.btn-folder-entry');
    let folderName = entry.textContent;
    switch (target.classList.value) {
      case 'btn-up':
        this.up(folderName);
        break;
      case 'btn-down':
        this.down(folderName);
        break;
      case 'btn-edit':
        this.edit(folderName);
        break;
      case 'btn-delete':
        this.delete(folderName);
        break;
      case 'btn-cancel':
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

  buildEntry(folderName) {
    let entry = document.createElement('div');
    entry.classList.add('entry-folder');
    let btnEntry = document.createElement('button');
    btnEntry.classList.add('btn-folder-entry');
    btnEntry.textContent = folderName;
    let btnMenu = this.buildBtnMenu();
    entry.appendChild(btnEntry);
    entry.appendChild(btnMenu);
    return entry;
  }

  delete(folderName) {
    this.bus.publish('page.folders.delete.click', folderName);
  }

  down(folderName) {
    this.bus.publish('page.folders.down.click', folderName);
  }

  edit(folderName) {
    this.bus.publish('page.folders.edit.click', folderName);
  }

  folderListUpdate(folderList) {
    this.folderList = folderList;
    this.updateList();
  }

  foldersHide() {
    hide(this.actionMenu);
  }

  foldersShow() {
    if (this.scrollReset) {
      this.scroll.scrollTop = 0;
      this.scrollReset = false;
    }
  }

  getElements() {
    let pane = document.querySelector('.pane-bookmarks');
    this.page = pane.querySelector('.page-folders');

    this.scroll = this.page.querySelector('.scroll-folders');

    this.list = this.scroll.querySelector('.list');
    this.actionMenu = this.scroll.querySelector('.action-menu');

    this.nav = this.page.querySelector('.nav-folders');
    this.btnBack = this.nav.querySelector('.btn-back');
  }

  initialize() {
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  listClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target.classList.contains('btn-folder-entry')) {
      let folderName = target.textContent;
      this.bus.publish('page.folders.select.click', folderName);
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
      this.bus.publish('page.folders.back.click', null);
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
    this.bus.subscribe('folders.list.update',
      (folderList) => {
        this.folderListUpdate(folderList);
      }
    );
    this.bus.subscribe('page.folders.hide',
      () => {
        this.foldersHide();
      }
    );
    this.bus.subscribe('page.folders.scroll.to.top',
      () => {
        this.scrollToTop();
      }
    );
    this.bus.subscribe('page.folders.show',
      () => {
        this.foldersShow();
      }
    );
  }

  up(folderName) {
    this.bus.publish('page.folders.up.click', folderName);
  }

  updateList() {
    removeAllChildren(this.list);
    let fragment = document.createDocumentFragment();
    this.folderList.forEach((folderName) => {
      let entry = this.buildEntry(folderName);
      fragment.appendChild(entry);
    });
    this.list.appendChild(fragment);
  }

}

export {
  PageFolders
};
