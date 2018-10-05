'use strict';

class PageFoldersDelete {

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

  deleteShow(folderName) {
    this.folderName = folderName;
    this.updateBanner();
  }

  getElements() {
    let pane = document.querySelector('.pane-bookmarks');
    this.page = pane.querySelector('.page-folders-delete');

    this.banner = this.page.querySelector('.banner-folders-delete');
    this.scroll = this.page.querySelector('.scroll-folders-delete');

    this.btnDelete = this.scroll.querySelector('.dialog-delete');
    
    this.nav = this.page.querySelector('.nav-folders-delete');
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
      this.bus.publish('page.folders.delete.back.click', null);
    }
  }

  scrollClick(event) {
    event.preventDefault();
    let target = event.target;
    if (target.classList.contains('dialog-delete')) {
      this.bus.publish('page.folders.delete.delete.click', this.folderName);
      return;
    }
  }

  subscribe() {
    this.bus.subscribe('page.folders.delete.show',
      (folderName) => {
        this.deleteShow(folderName);
      }
    );
  }

  updateBanner() {
    this.banner.innerHTML = `Delete Folder:<br>${this.folderName}`;
  }

}

export {
  PageFoldersDelete
};
