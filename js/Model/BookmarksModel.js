'use strict';

const numSortAscend = (a, b) => a - b;
const numSortDescend = (a, b) => b - a;

class BookmarksModel {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  add(verseIdx) {
    let bookmarks = this.bookmarksFolder.bookmarks;
    if (bookmarks.indexOf(verseIdx) !== -1) {
      return;
    }
    this.bookmarksFolder.bookmarks = [verseIdx, ...bookmarks];
    this.change();
  }

  change() {
    this.depotSave();
    this.bus.publish('bookmarks.update', this.bookmarksFolder);
    this.bus.publish('folders.list.update', this.getFoldersList());
  }

  copy(copyPkg) {
    let toFolder = this.getFolder(copyPkg.to);
    toFolder.bookmarks = [copyPkg.verseIdx, ...toFolder.bookmarks];
    this.change();
  }

  createFolder(folderName) {
    return {
      name: folderName,
      bookmarks: []
    };
  }

  createTome() {
    return {
      name: this.tome.name,
      folderName: 'Default',
      folders: [this.createFolder('Default')]
    };
  }

  delete(verseIdx) {
    let bookmarks = this.bookmarksFolder.bookmarks;
    let index = bookmarks.indexOf(verseIdx);
    if (index === -1) {
      return;
    }
    bookmarks.splice(index, 1);
    this.change();
  }

  depotSave() {
    localStorage.setItem('bookmarksDepot', JSON.stringify(this.bookmarksDepot));
  }

  down(verseIdx) {
    let bookmarks = this.bookmarksFolder.bookmarks;
    let index = bookmarks.indexOf(verseIdx);
    if (index === bookmarks.length - 1 || index === -1) {
      return;
    }
    this.reorder(index, index + 1);
  }

  foldersAdd(folderName) {
    let bookmarksFolder = this.getFolder(folderName);
    if (bookmarksFolder) {
      return;
    }
    bookmarksFolder = this.createFolder(folderName);
    let folders = this.tomeBookmarks.folders;
    this.tomeBookmarks.folders = [bookmarksFolder, ...folders];
    this.bookmarksFolder = this.tomeBookmarks.folders[0];
    this.tomeBookmarks.folderName = folderName;
    this.change();
  }

  foldersChange(folderName) {
    this.tomeBookmarks.folderName = folderName;
    this.bookmarksFolder = this.getFolder(folderName);
    this.change();
  }

  foldersDelete(folderName) {
    let idx = this.getFolderIdx(folderName);
    this.tomeBookmarks.folders.splice(idx, 1);
    this.bus.publish('folders.list.update', this.getFoldersList());
    this.resetFolder();
  }

  foldersDown(folderName) {
    let folders = this.tomeBookmarks.folders;
    let index = folders.findIndex((folder) => folder.name === folderName);
    if (index === folders.length - 1 || index === -1) {
      return;
    }
    this.foldersReorder(index, index + 1);
    this.bus.publish('folders.list.update', this.getFoldersList());
  }

  foldersRename(namePkg) {
    let oldFolder = this.getFolder(namePkg.old);
    oldFolder.name = namePkg.new;
    this.tomeBookmarks.folderName = namePkg.new;
    this.bus.publish('folders.list.update', this.getFoldersList());
    this.change();
  }

  foldersReorder(fromIdx, toIdx) {
    this.tomeBookmarks.folders.splice(
      toIdx, 0, this.tomeBookmarks.folders.splice(fromIdx, 1)[0]
    );
    this.change();
  }

  foldersUp(folderName) {
    let folders = this.tomeBookmarks.folders;
    let index = folders.findIndex((folder) => folder.name === folderName);
    if (index === 0 || index === -1) {
      return;
    }
    this.foldersReorder(index, index - 1);
    this.bus.publish('folders.list.update', this.getFoldersList());
  }

  get() {
    this.getDepot();
    this.change();
  }

  getDepot() {
    let value = localStorage.getItem('bookmarksDepot');
    if (!value) {
      this.bookmarksDepot = [];
    } else {
      this.bookmarksDepot = JSON.parse(value);
    }
    this.tomeBookmarks = this.getTome();
    if (!this.tomeBookmarks) {
      let tomeBookmarks = this.createTome();
      let idx = this.bookmarksDepot.length;
      this.bookmarksDepot.push(tomeBookmarks);
      this.tomeBookmarks = this.bookmarksDepot[idx];
    }
    this.bookmarksFolder =
      this.getFolder(this.tomeBookmarks.folderName);
  }

  getFolder(folderName) {
    return this.tomeBookmarks.folders.find((bookmarksFolder) => {
      return bookmarksFolder.name === folderName;
    });
  }

  getFolderIdx(folderName) {
    return this.tomeBookmarks.folders.findIndex((bookmarksFolder) => {
      return bookmarksFolder.name === folderName;
    });
  }

  getFoldersList() {
    return this.tomeBookmarks.folders.map((folder) => folder.name);
  }

  getTome() {
    return this.bookmarksDepot.find((tomeBookmarks) => {
      return tomeBookmarks.name === this.tome.name;
    });
  }

  initialize() {
    this.subscribe();
  }

  move(movePkg) {
    let toFolder = this.getFolder(movePkg.to);
    toFolder.bookmarks = [movePkg.verseIdx, ...toFolder.bookmarks];

    let bookmarks = this.bookmarksFolder.bookmarks;
    let index = bookmarks.indexOf(movePkg.verseIdx);
    if (index === -1) {
      return;
    }
    bookmarks.splice(index, 1);
    this.change();
  }

  moveCopyListChange(verseIdx) {
    let foldersNotFoundIn = this.tomeBookmarks.folders.filter(
      (folder) => !folder.bookmarks.some((element) => element === verseIdx)
    );
    let moveCopyList = foldersNotFoundIn.map((folder) => folder.name);
    this.bus.publish('move.copy.list.update', moveCopyList);
  }

  reorder(fromIdx, toIdx) {
    this.bookmarksFolder.bookmarks.splice(
      toIdx, 0, this.bookmarksFolder.bookmarks.splice(fromIdx, 1)[0]
    );
    this.change();
  }

  resetFolder() {
    if (this.tomeBookmarks.folders.length === 0) {
      this.foldersAdd('Default');
    }
    let firstFolder = this.tomeBookmarks.folders[0].name;
    this.foldersChange(firstFolder);
  }

  sort(sorter) {
    if (this.bookmarksFolder.bookmarks.length === 0) {
      return;
    }
    this.bookmarksFolder.bookmarks.sort(sorter);
    this.change();
  }

  subscribe() {
    this.bus.subscribe('bookmarks.add',
      (verseIdx) => {
        this.add(verseIdx);
      }
    );
    this.bus.subscribe('bookmarks.copy',
      (copyPkg) => {
        this.copy(copyPkg);
      }
    );
    this.bus.subscribe('bookmarks.delete',
      (verseIdx) => {
        this.delete(verseIdx);
      }
    );
    this.bus.subscribe('bookmarks.down',
      (verseIdx) => {
        this.down(verseIdx);
      }
    );
    this.bus.subscribe('bookmarks.get',
      () => {
        this.get();
      }
    );
    this.bus.subscribe('bookmarks.move',
      (movePkg) => {
        this.move(movePkg);
      }
    );
    this.bus.subscribe('bookmarks.move.copy.list.change',
      (verseIdx) => {
        this.moveCopyListChange(verseIdx);
      }
    );
    this.bus.subscribe('bookmarks.sort.ascend',
      () => {
        this.sort(numSortAscend);
      }
    );
    this.bus.subscribe('bookmarks.sort.descend',
      () => {
        this.sort(numSortDescend);
      }
    );
    this.bus.subscribe('bookmarks.up',
      (verseIdx) => {
        this.up(verseIdx);
      }
    );
    this.bus.subscribe('bookmarks.folders.add',
      (folderName) => {
        this.foldersAdd(folderName);
      }
    );
    this.bus.subscribe('bookmarks.folders.change',
      (folderName) => {
        this.foldersChange(folderName);
      }
    );
    this.bus.subscribe('bookmarks.folders.delete',
      (folderName) => {
        this.foldersDelete(folderName);
      }
    );
    this.bus.subscribe('bookmarks.folders.down',
      (folderName) => {
        this.foldersDown(folderName);
      }
    );
    this.bus.subscribe('bookmarks.folders.rename',
      (namePkg) => {
        this.foldersRename(namePkg);
      }
    );
    this.bus.subscribe('bookmarks.folders.up',
      (folderName) => {
        this.foldersUp(folderName);
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

  up(verseIdx) {
    let bookmarks = this.bookmarksFolder.bookmarks;
    let index = bookmarks.indexOf(verseIdx);
    if (index === 0 || index === -1) {
      return;
    }
    this.reorder(index, index - 1);
  }

}

export {
  BookmarksModel
};
