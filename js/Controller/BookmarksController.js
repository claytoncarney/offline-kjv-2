'use strict';

import {
  getChapter
} from '../util.js';

class BookmarksController {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  backClick() {
    this.bus.publish('sidebar.change', 'none');
  }

  deleteClick(verseIdx) {
    this.bus.publish('bookmarks.delete', verseIdx);
  }

  downClick(verseIdx) {
    this.bus.publish('bookmarks.down', verseIdx);
  }

  foldersAddBackClick() {
    this.bus.publish('page.folders.add.hide', null);
    this.bus.publish('page.bookmarks.show', null);
  }

  foldersAddClick() {
    this.bus.publish('page.bookmarks.hide', null);
    this.bus.publish('page.folders.add.show', null);
  }

  foldersAddSaveClick(name) {
    this.bus.publish('bookmarks.folders.add', name);
    this.bus.publish('page.folders.add.hide', null);
    this.bus.publish('page.bookmarks.show', null);
    this.bus.publish('page.folders.scroll.to.top', null);
  }

  foldersBackClick() {
    this.bus.publish('page.folders.hide', null);
    this.bus.publish('page.bookmarks.show', null);
  }

  foldersClick() {
    this.bus.publish('page.bookmarks.hide', null);
    this.bus.publish('page.folders.show', null);
  }

  foldersDeleteBackClick() {
    this.bus.publish('page.folders.delete.hide', null);
    this.bus.publish('page.folders.show', null);
  }

  foldersDeleteClick(folderName) {
    this.bus.publish('page.folders.hide');
    this.bus.publish('page.folders.delete.show', folderName);
  }

  foldersDeleteDeleteClick(folderName) {
    this.bus.publish('bookmarks.folders.delete', folderName);
    this.bus.publish('page.folders.delete.hide', null);
    this.bus.publish('page.folders.show', null);
  }

  foldersDownClick(folderName) {
    this.bus.publish('bookmarks.folders.down', folderName);
  }

  foldersEditClick(folderName) {
    this.bus.publish('page.folders.hide', null);
    this.bus.publish('page.folders.rename.show', folderName);
  }

  foldersRenameBackClick() {
    this.bus.publish('page.folders.rename.hide', null);
    this.bus.publish('page.folders.show', null);
  }

  foldersRenameSaveClick(names) {
    this.bus.publish('bookmarks.folders.rename', names);
    this.bus.publish('page.folders.rename.hide', null);
    this.bus.publish('page.folders.show', null);
  }

  foldersSelectClick(folderName) {
    this.bus.publish('bookmarks.folders.change', folderName);
    this.bus.publish('page.folders.hide', null);
    this.bus.publish('page.bookmarks.show', null);
  }

  foldersUpClick(folderName) {
    this.bus.publish('bookmarks.folders.up', folderName);
  }

  gotoBookmark(verseIdx) {
    let chapter = getChapter(this.tome, verseIdx);
    this.bus.publish('chapter.change', chapter);
    if (this.panes === 1) {
      this.bus.publish('sidebar.click', 'none');
    }
    this.bus.publish('page.read.scroll.to.verse', verseIdx);
  }

  initialize() {
    this.subscribe();
  }

  moveCopyClick(verseIdx) {
    this.bus.publish('page.bookmarks.hide', null);
    this.bus.publish('bookmarks.move.copy.list.change', verseIdx);
    this.bus.publish('page.move.copy.show', verseIdx);
    this.bus.publish('page.move.copy.scroll.to.top');
  }

  moveCopyBackClick() {
    this.bus.publish('page.move.copy.hide', null);
    this.bus.publish('page.bookmarks.show', null);
  }

  moveCopyCopyClick(copyPkg) {
    this.bus.publish('bookmarks.copy', copyPkg);
  }

  moveCopyMoveClick(movePkg) {
    this.bus.publish('bookmarks.move', movePkg);
  }

  panesUpdate(panes) {
    this.panes = panes;
  }

  selectClick(verseIdx) {
    this.gotoBookmark(verseIdx);
  }

  sortAscendingClick() {
    this.bus.publish('bookmarks.sort.ascend', null);
  }

  sortDescendingClick() {
    this.bus.publish('bookmarks.sort.descend', null);
  }

  subscribe() {
    this.bus.subscribe('page.bookmarks.back.click',
      () => {
        this.backClick();
      }
    );
    this.bus.subscribe('page.bookmarks.delete.click',
      (verseIdx) => {
        this.deleteClick(verseIdx);
      }
    );
    this.bus.subscribe('page.bookmarks.down.click',
      (verseIdx) => {
        this.downClick(verseIdx);
      }
    );
    this.bus.subscribe('page.bookmarks.folders.add.click',
      () => {
        this.foldersAddClick();
      }
    );
    this.bus.subscribe('page.bookmarks.folders.click',
      () => {
        this.foldersClick();
      }
    );
    this.bus.subscribe('page.bookmarks.move.copy.click',
      (verseIdx) => {
        this.moveCopyClick(verseIdx);
      }
    );
    this.bus.subscribe('page.bookmarks.select.click',
      (verseIdx) => {
        this.selectClick(verseIdx);
      }
    );
    this.bus.subscribe('page.bookmarks.sort.ascend.click',
      () => {
        this.sortAscendingClick();
      }
    );
    this.bus.subscribe('page.bookmarks.sort.descend.click',
      () => {
        this.sortDescendingClick();
      }
    );
    this.bus.subscribe('page.bookmarks.up.click',
      (verseIdx) => {
        this.upClick(verseIdx);
      }
    );
    this.bus.subscribe('page.folders.add.back.click',
      () => {
        this.foldersAddBackClick();
      }
    );
    this.bus.subscribe('page.folders.add.save.click',
      (name) => {
        this.foldersAddSaveClick(name);
      }
    );
    this.bus.subscribe('page.folders.back.click',
      () => {
        this.foldersBackClick();
      }
    );
    this.bus.subscribe('page.folders.delete.back.click',
      () => {
        this.foldersDeleteBackClick();
      }
    );
    this.bus.subscribe('page.folders.delete.click',
      (folderName) => {
        this.foldersDeleteClick(folderName);
      }
    );
    this.bus.subscribe('page.folders.delete.delete.click',
      (folderName) => {
        this.foldersDeleteDeleteClick(folderName);
      }
    );
    this.bus.subscribe('page.folders.down.click',
      (folderName) => {
        this.foldersDownClick(folderName);
      }
    );
    this.bus.subscribe('page.folders.edit.click',
      (folderName) => {
        this.foldersEditClick(folderName);
      }
    );
    this.bus.subscribe('page.folders.rename.back.click',
      () => {
        this.foldersRenameBackClick();
      }
    );
    this.bus.subscribe('page.folders.rename.save.click',
      (namePkg) => {
        this.foldersRenameSaveClick(namePkg);
      }
    );
    this.bus.subscribe('page.folders.select.click',
      (folderName) => {
        this.foldersSelectClick(folderName);
      }
    );
    this.bus.subscribe('page.folders.up.click',
      (folderName) => {
        this.foldersUpClick(folderName);
      }
    );
    this.bus.subscribe('page.move.copy.back.click',
      () => {
        this.moveCopyBackClick();
      }
    );
    this.bus.subscribe('page.move.copy.copy.click',
      (copyPkg) => {
        this.moveCopyCopyClick(copyPkg);
      }
    );
    this.bus.subscribe('page.move.copy.move.click',
      (movePkg) => {
        this.moveCopyMoveClick(movePkg);
      }
    );
    this.bus.subscribe('panes.update',
      (panes) => {
        this.panesUpdate(panes);
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

  upClick(verseIdx) {
    this.bus.publish('bookmarks.up', verseIdx);
  }

}

export {
  BookmarksController
};
