'use strict';

class ContentsController {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  backClick() {
    this.bus.publish('sidebar.change', 'none');
  }

  bookClick(bookIdx) {
    if (this.panes === 1) {
      if (this.tome.books[bookIdx].chapterCount > 1) {
        this.bus.publish('contents.scroll.book');
        return;
      }
    }
    let firstChapterIdx = this.tome.books[bookIdx].firstChapterIdx;
    let chapterIdx = this.tome.chapters[firstChapterIdx].chapterIdx;
    let chapterName = this.tome.chapters[firstChapterIdx].chapterName;
    let chapter = {
      bookIdx: bookIdx,
      chapterIdx: chapterIdx,
      chapterName: chapterName
    };
    this.chapterClick(chapter);
  }

  chapterClick(chapter) {
    this.chapter = chapter;
    this.bus.publish('chapter.change', chapter);
    if (this.panes === 1) {
      this.bus.publish('sidebar.click', 'none');
    }
    this.bus.publish('page.read.scroll.to.top', null);
  }

  initialize() {
    this.subscribe();
  }

  panesUpdate(panes) {
    this.panes = panes;
  }

  subscribe() {
    this.bus.subscribe('page.contents.back.click',
      () => {
        this.backClick();
      }
    );
    this.bus.subscribe('page.contents.book.click',
      (bookIdx) => {
        this.bookClick(bookIdx);
      }
    );
    this.bus.subscribe('page.contents.chapter.click',
      (chapter) => {
        this.chapterClick(chapter);
      }
    );
    this.bus.subscribe('page.contents.tomes.click',
      (topic) => {
        this.tomesClick(topic);
      }
    );
    this.bus.subscribe('page.tomes.back.click',
      () => {
        this.tomesBackClick();
      }
    );
    this.bus.subscribe('page.tomes.select.click',
      (tomeName) => {
        this.tomeSelect(tomeName);
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

  tomesBackClick() {
    this.bus.publish('page.tomes.hide', null);
    this.bus.publish('page.contents.show', null);
  }

  tomesClick() {
    this.bus.publish('page.contents.hide', null);
    this.bus.publish('page.tomes.show', null);
  }

  tomeSelect(tomeName) {
    this.bus.publish('page.tomes.hide', null);
    this.bus.publish('page.contents.show', null);
    this.bus.publish('tome.change', tomeName);
  }

  tomeUpdate(tome) {
    this.tome = tome;
  }

}

export {
  ContentsController
};
