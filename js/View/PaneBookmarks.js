'use strict';

import {
  hide,
  show
} from '../util.js';

class PaneBookmarks {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  bookmarksHide() {
    hide(this.bookmarks);
  }

  bookmarksShow() {
    show(this.bookmarks);
  }

  foldersHide() {
    hide(this.folders);
  }

  foldersShow() {
    show(this.folders);
  }

  foldersAddHide() {
    hide(this.foldersAdd);
  }

  foldersAddShow() {
    show(this.foldersAdd);
  }

  foldersDeleteHide() {
    hide(this.foldersDelete);
  }

  foldersDeleteShow() {
    show(this.foldersDelete);
  }

  foldersRenameHide() {
    hide(this.foldersRename);
  }

  foldersRenameShow() {
    show(this.foldersRename);
  }

  getElements() {
    let pane = document.querySelector('.pane-bookmarks');

    this.bookmarks = pane.querySelector('.page-bookmarks');
    this.folders = pane.querySelector('.page-folders');
    this.foldersAdd = pane.querySelector('.page-folders-add');
    this.foldersDelete = pane.querySelector('.page-folders-delete');
    this.foldersRename = pane.querySelector('.page-folders-rename');
    this.moveCopy = pane.querySelector('.page-move-copy');
  }

  initialize() {
    this.getElements();
    this.subscribe();
  }

  moveCopyHide() {
    hide(this.moveCopy);
  }

  moveCopyShow() {
    show(this.moveCopy);
  }

  paneHide() {
    this.bus.publish('page.bookmarks.hide', null);
    this.bus.publish('page.folders.hide', null);
    this.bus.publish('page.folders.add.hide', null);
    this.bus.publish('page.folders.delete.hide', null);
    this.bus.publish('page.folders.rename.hide', null);
    this.bus.publish('page.move.copy.hide', null);
  }

  paneShow() {
    this.bus.publish('page.bookmarks.show', null);
  }

  subscribe() {
    this.bus.subscribe('page.bookmarks.hide',
      () => {
        this.bookmarksHide();
      }
    );
    this.bus.subscribe('page.bookmarks.show',
      () => {
        this.bookmarksShow();
      }
    );
    this.bus.subscribe('page.folders.hide',
      () => {
        this.foldersHide();
      }
    );
    this.bus.subscribe('page.folders.show',
      () => {
        this.foldersShow();
      }
    );
    this.bus.subscribe('page.folders.add.hide',
      () => {
        this.foldersAddHide();
      }
    );
    this.bus.subscribe('page.folders.add.show',
      () => {
        this.foldersAddShow();
      }
    );
    this.bus.subscribe('page.folders.delete.hide',
      () => {
        this.foldersDeleteHide();
      }
    );
    this.bus.subscribe('page.folders.delete.show',
      () => {
        this.foldersDeleteShow();
      }
    );
    this.bus.subscribe('page.folders.rename.hide',
      () => {
        this.foldersRenameHide();
      }
    );
    this.bus.subscribe('page.folders.rename.show',
      () => {
        this.foldersRenameShow();
      }
    );
    this.bus.subscribe('page.move.copy.hide',
      () => {
        this.moveCopyHide();
      }
    );
    this.bus.subscribe('page.move.copy.show',
      () => {
        this.moveCopyShow();
      }
    );
    this.bus.subscribe('pane.bookmarks.hide',
      () => {
        this.paneHide();
      }
    );
    this.bus.subscribe('pane.bookmarks.show',
      () => {
        this.paneShow();
      }
    );
  }

}

export {
  PaneBookmarks
};
