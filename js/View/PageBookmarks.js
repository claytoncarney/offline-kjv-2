'use strict';

import {
  deactivate,
  getDataVerseIdx,
  hide,
  removeAllChildren,
  show
} from '../util.js';

class PageBookmarks {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  actionMenuClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    let ref = this.activeEntry.querySelector('.btn-ref');
    let verseIdx = getDataVerseIdx(ref);
    switch (target.classList.value) {
      case 'btn-up':
        this.up(verseIdx);
        break;
      case 'btn-down':
        this.down(verseIdx);
        break;
      case 'btn-move-copy':
        this.moveCopy(verseIdx);
        break;
      case 'btn-delete':
        this.delete(verseIdx);
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
    this.tools.addEventListener('click',
      (event) => {
        this.toolsClick(event);
      }
    );
  }

  bookmarksHide() {
    hide(this.actionMenu);
  }
  
  bookmarksShow() {
    if (this.scrollReset) {
      this.scroll.scrollTop = 0;
      this.scrollReset = false;
    }
  }

  bookmarksUpdate(bookmarksFolder) {
    this.bookmarksFolder = bookmarksFolder;
    this.updateBanner();
    this.updateList();
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

  buildEntry(verseIdx) {
    let entry = document.createElement('div');
    entry.classList.add('entry-bookmarks');
    let btnRef = document.createElement('button');
    btnRef.classList.add('btn-ref');
    btnRef.textContent = this.tome.refs[verseIdx].name;
    btnRef.setAttribute('data-verse-idx', verseIdx);
    entry.appendChild(btnRef);
    let btnMenu = this.buildBtnMenu();
    entry.appendChild(btnMenu);
    return entry;
  }

  delete(verseIdx) {
    this.bus.publish('page.bookmarks.delete.click', verseIdx);
  }

  down(verseIdx) {
    this.bus.publish('page.bookmarks.down.click', verseIdx);
  }

  getElements() {
    let pane = document.querySelector('.pane-bookmarks');
    this.page = pane.querySelector('.page-bookmarks');

    this.scroll = this.page.querySelector('.scroll-bookmarks');
    this.tools = this.page.querySelector('.tools-bookmarks');
    this.nav = this.page.querySelector('.nav-bookmarks');

    this.actionMenu = this.scroll.querySelector('.action-menu');
    this.empty = this.scroll.querySelector('.empty');
    this.list = this.scroll.querySelector('.list');

    this.banner = this.tools.querySelector('.banner-bookmarks');
    this.btnFoldersAdd = this.tools.querySelector('.btn-folders-add');
    this.btnFolders = this.tools.querySelector('.btn-folders');

    this.btnBack = this.nav.querySelector('.btn-back');
    this.btnSortAscend = this.nav.querySelector('.btn-sort-ascend');
    this.btnSortDescend = this.nav.querySelector('.btn-sort-descend');
  }

  initialize() {
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  listClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target.classList.contains('btn-ref')) {
      let verseIdx = getDataVerseIdx(target);
      this.select(verseIdx);
      return;
    }
    if (target.classList.contains('btn-menu')) {
      let ref = target.previousSibling;
      this.menuClick(ref);
      return;
    }
    return;
  }

  menuClick(target) {
    this.showActionMenu(target);
  }

  moveCopy(verseIdx) {
    this.bus.publish('page.bookmarks.move.copy.click', verseIdx);
  }

  navClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    switch (target) {
      case this.btnBack:
        this.bus.publish('page.bookmarks.back.click', null);
        break;
      case this.btnSortAscend:
        this.bus.publish('page.bookmarks.sort.ascend.click', null);
        break;
      case this.btnSortDescend:
        this.bus.publish('page.bookmarks.sort.descend.click', null);
        break;
    }
  }

  scrollToTop() {
    if (this.page.classList.contains('hide')) {
      this.scrollReset = true;
      return;
    }
    this.scroll.scrollTop = 0;
  }

  select(verseIdx) {
    this.bus.publish('page.bookmarks.select.click', verseIdx);
  }

  showActionMenu(target) {
    this.activeEntry = target.closest('div');
    let top = target.offsetTop;
    this.actionMenu.style.top = `${top}px`;
    show(this.actionMenu);
  }

  subscribe() {
    this.bus.subscribe('page.bookmarks.hide',
      () => {
        this.bookmarksHide();
      }
    );
    this.bus.subscribe('page.bookmarks.scroll.to.top',
      () => {
        this.scrollToTop();
      }
    );
    this.bus.subscribe('page.bookmarks.show',
      () => {
        this.bookmarksShow();
      }
    );
    this.bus.subscribe('bookmarks.update',
      (bookmarksFolder) => {
        this.bookmarksUpdate(bookmarksFolder);
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

  toolsClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    switch (target) {
      case this.btnFoldersAdd:
        this.bus.publish('page.bookmarks.folders.add.click', null);
        break;
      case this.btnFolders:
        this.bus.publish('page.bookmarks.folders.click', null);
        break;
    }
  }

  up(verseIdx) {
    this.bus.publish('page.bookmarks.up.click', verseIdx);
  }

  updateBanner() {
    this.banner.innerHTML = `Bookmarks Folder:<br>${this.bookmarksFolder.name}`;
  }

  updateList() {
    removeAllChildren(this.list);
    if (this.bookmarksFolder.bookmarks.length === 0) {
      show(this.empty);
      return;
    } else {
      hide(this.empty);
    }
    let fragment = document.createDocumentFragment();
    this.bookmarksFolder.bookmarks.forEach((verseIdx) => {
      let ref = this.buildEntry(verseIdx);
      fragment.appendChild(ref);
    });
    this.list.appendChild(fragment);
  }

}

export {
  PageBookmarks
};
