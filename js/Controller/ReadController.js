'use strict';

class ReadController {
  
  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  columnsClick(columns) {
    this.columns = columns;
    this.bus.publish('columns.change', columns);
  }

  initialize() {
    this.subscribe();
  }

  subscribe() {
    this.bus.subscribe('columns.click',
      (columns) => { this.columnsClick(columns); }
    );
    this.bus.subscribe('verse.click.delete.bookmarks',
      (verseIdx) => { this.verseClickDeleteBookmarks(verseIdx); }
    );
    this.bus.subscribe('verse.click.add.bookmarks',
      (verseIdx) => { this.verseClickAddBookmarks(verseIdx); }
    );
  }

  verseClickAddBookmarks(verseIdx) {
    this.bus.publish('bookmarks.add', verseIdx);
    this.bus.publish('page.bookmarks.scroll.to.top', null);
  }

  verseClickDeleteBookmarks(verseIdx) {
    this.bus.publish('bookmarks.delete', verseIdx);
  }
}

export { ReadController };
