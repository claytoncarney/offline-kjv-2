'use strict';

import {
  hide,
  removeAllChildren,
  show
} from '../util.js';

class PageMoveCopy {

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
      case 'btn-move':
        this.move(folderName);
        break;
      case 'btn-copy':
        this.copy(folderName);
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

  bookmarksUpdate(bookmarksFolder) {
    this.bookmarksFolder = bookmarksFolder;
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

  copy(folderName) {
    let copyPkg = {
      to: folderName,
      verseIdx: this.verseIdx
    };
    this.bus.publish('page.move.copy.copy.click', copyPkg);
  }

  getElements() {
    let pane = document.querySelector('.pane-bookmarks');
    this.page = pane.querySelector('.page-move-copy');

    this.scroll = this.page.querySelector('.scroll-move-copy');

    this.actionMenu = this.scroll.querySelector('.action-menu');
    this.empty = this.scroll.querySelector('.empty');
    this.list = this.scroll.querySelector('.list');

    this.tools = this.page.querySelector('.tools-move-copy');
    this.banner = this.tools.querySelector('.banner-move-copy');

    this.nav = this.page.querySelector('.nav-move-copy');
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
    if (target.classList.contains('btn-menu')) {
      let entry = target.previousSibling;
      this.btnMenuClick(entry);
      return;
    }
  }

  move(folderName) {
    let movePkg = {
      to: folderName,
      verseIdx: this.verseIdx
    };
    this.bus.publish('page.move.copy.move.click', movePkg);
  }

  moveCopyListUpdate(moveCopyList) {
    this.moveCopyList = moveCopyList;
    this.updateList();
  }

  moveCopyHide() {
    hide(this.actionMenu);
  }
  
  moveCopyShow(verseIdx) {
    this.verseIdx = verseIdx;
    this.updateBanner();
  }

  navClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      this.bus.publish('page.move.copy.back.click', null);
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
    this.bus.subscribe('bookmarks.update',
      (bookmarksFolder) => {
        this.bookmarksUpdate(bookmarksFolder);
      }
    );
    this.bus.subscribe('move.copy.list.update',
      (moveCopyList) => {
        this.moveCopyListUpdate(moveCopyList);
      }
    );
    this.bus.subscribe('page.move.copy.hide',
      () => {
        this.moveCopyHide();
      }
    );
    this.bus.subscribe('page.move.copy.scroll.to.top',
      () => {
        this.scrollToTop();
      }
    );
    this.bus.subscribe('page.move.copy.show',
      (verseIdx) => {
        this.moveCopyShow(verseIdx);
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

  updateBanner() {
    let ref = this.tome.refs[this.verseIdx].name;
    this.banner.innerHTML = `${ref} <br> Move/Copy to Folder:`;
  }

  updateList() {
    removeAllChildren(this.list);
    if (this.moveCopyList.length === 0) {
      show(this.empty);
      return;
    }
    hide(this.empty);
    let fragment = document.createDocumentFragment();
    this.moveCopyList.forEach((folderName) => {
      let entry = this.buildEntry(folderName);
      fragment.appendChild(entry);
    });
    this.list.appendChild(fragment);
  }

}

export {
  PageMoveCopy
};
