'use strict';

class PageFoldersAdd {

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
    this.scroll.addEventListener('click',
      (event) => {
        this.scrollClick(event);
      }
    );
  }

  foldersAddShow() {
    this.input.focus();
  }

  getElements() {
    let pane = document.querySelector('.pane-bookmarks');
    this.page = pane.querySelector('.page-folders-add');
    
    this.scroll = this.page.querySelector('.scroll-folders-add');

    this.input = this.scroll.querySelector('.folder-name');
    this.btnSave = this.scroll.querySelector('.dialog-save');

    this.nav = this.page.querySelector('.nav-folders-add');
    this.btnBack = this.nav.querySelector('.btn-back');
  }

  initialize() {
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  navClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      this.bus.publish('page.folders.add.back.click', null);
    }
  }

  scrollClick(event) {
    event.preventDefault();
    let target = event.target;
    if (target.classList.contains('dialog-save')) {
      let name = this.input.value;
      if (!name) {
        return;
      }
      this.bus.publish('page.folders.add.save.click', name);
      this.input.value = '';
      return;
    }
  }

  subscribe() {
    this.bus.subscribe('page.folders.add.show',
      () => {
        this.foldersAddShow();
      }
    );
  }

}

export {
  PageFoldersAdd
};
