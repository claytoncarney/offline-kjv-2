'use strict';

class ContentsModel {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  chapterChange(chapter) {
    this.entry.chapter = chapter;
    this.contentsDepotSave();
    this.bus.publish('chapter.update', this.entry.chapter);
  }

  contentsGet() {
    this.getContentsDepot();
    this.chapterChange(this.entry.chapter);
  }

  contentsDepotSave() {
    localStorage.setItem('contentsDepot', JSON.stringify(this.contentsDepot));
  }

  getContentsDepot() {
    let value = localStorage.getItem('contentsDepot');
    if (!value) {
      this.contentsDepot = [];
    } else {
      this.contentsDepot = JSON.parse(value);
    }
    this.getEntry();
    if (!this.entry) {
      this.initilizeEntry();
      this.contentsDepot.push(this.entry);
    }
  }

  getEntry() {
    let entry = this.contentsDepot.find((entry) => {
      return entry.tomeName === this.tome.name;
    });
    this.entry = entry;
  }

  initialize() {
    this.subscribe();
  }

  initilizeEntry() {
    let entry = {
      tomeName: this.tome.name,
      chapter: {
        bookIdx: 0,
        chapterIdx: 0,
        chapterName: this.tome.chapters[0].chapterName
      }
    };
    this.entry = entry;
  }

  subscribe() {
    this.bus.subscribe('chapter.change',
      (chapter) => {
        this.chapterChange(chapter);
      }
    );
    this.bus.subscribe('contents.get',
      () => {
        this.contentsGet();
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

}

export {
  ContentsModel
};
