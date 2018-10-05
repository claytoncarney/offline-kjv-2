'use strict';

class PageFoldersRename {

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

  getElements() {
    let pane = document.querySelector('.pane-bookmarks');
    this.page = pane.querySelector('.page-folders-rename');
    this.banner = this.page.querySelector('.banner-folders-rename');
    this.scroll = this.page.querySelector('.scroll-folders-rename');

    this.input = this.scroll.querySelector('.new-name');
    this.btnSave = this.scroll.querySelector('.dialog-save');
    
    this.nav = this.page.querySelector('.nav-folders-rename');
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
      this.bus.publish('page.folders.rename.back.click', null);
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
      this.namePkg.new = name;
      this.bus.publish('page.folders.rename.save.click', this.namePkg);
      this.input.value = '';
      return;
    }
  }

  renameShow(folderName) {
    this.folderName = folderName;
    this.namePkg = { old: folderName };
    this.input.value = folderName;
    this.input.focus();
    this.updateBanner();
  }

  subscribe() {
    this.bus.subscribe('page.folders.rename.show',
      (folderName) => {
        this.renameShow(folderName);
      }
    );
  }

  updateBanner() {
    this.banner.innerHTML = `Rename Folder:<br>${this.folderName}`;
  }

}

export {
  PageFoldersRename
};
