'use strict';

import {
  getChapter
} from '../util.js';

class SearchController {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  backClick() {
    this.bus.publish('sidebar.change', 'none');
  }

  filterSelectClick(searchFilter) {
    this.searchFilter = searchFilter;
    this.bus.publish('search.filter.change', this.searchFilter);
    this.bus.publish('page.filters.hide', null);
    this.bus.publish('page.results.show', null);
    this.bus.publish('page.results.scroll.to.top', null);
  }

  filtersBackClick() {
    this.bus.publish('page.filters.hide', null);
    this.bus.publish('page.results.show', null);
  }

  filtersClick() {
    this.bus.publish('page.results.hide', null);
    this.bus.publish('page.filters.show', null);
  }

  goClick(searchStr) {
    this.searchStr = searchStr;
    this.bus.publish('search.str.change', this.searchStr);
    this.bus.publish('page.results.show', null);
    this.bus.publish('page.results.scroll.to.top', null);
    this.bus.publish('page.filters.scroll.to.top', null);
    this.bus.publish('page.history.scroll.to.top', null);
  }

  historyBackClick() {
    this.bus.publish('page.history.hide', null);
    this.bus.publish('page.results.show', null);
  }

  historyClick() {
    this.bus.publish('page.results.hide', null);
    this.bus.publish('page.history.show', null);
  }

  historyDeleteClick(searchStr) {
    this.bus.publish('page.history.delete', searchStr);
  }

  historyDownClick(searchStr) {
    this.bus.publish('page.history.down', searchStr);
  }

  historySelectClick(searchStr) {
    this.searchStr = searchStr;
    this.bus.publish('search.str.change', this.searchStr);
    this.bus.publish('page.history.hide', null);
    this.bus.publish('page.results.show', null);
    this.bus.publish('page.results.scroll.to.top', null);
    this.bus.publish('page.filters.scroll.to.top', null);
  }

  historyUpClick(searchStr) {
    this.bus.publish('page.history.up', searchStr);
  }

  initialize() {
    this.subscribe();
  }

  panesUpdate(panes) {
    this.panes = panes;
  }

  resultsClick(verseIdx) {
    let chapter = getChapter(this.tome, verseIdx);
    this.bus.publish('chapter.change', chapter);
    if (this.panes === 1) {
      this.bus.publish('sidebar.click', 'none');
    }
    this.bus.publish('page.read.scroll.to.verse', verseIdx);
  }

  subscribe() {
    this.bus.subscribe('page.filters.back.click',
      () => {
        this.filtersBackClick();
      }
    );
    this.bus.subscribe('page.filters.select.click',
      (searchFilter) => {
        this.filterSelectClick(searchFilter);
      }
    );
    this.bus.subscribe('page.history.back.click',
      () => {
        this.historyBackClick();
      }
    );
    this.bus.subscribe('page.history.delete.click',
      (searchStr) => {
        this.historyDeleteClick(searchStr);
      }
    );
    this.bus.subscribe('page.history.down.click',
      (searchStr) => {
        this.historyDownClick(searchStr);
      }
    );
    this.bus.subscribe('page.history.select.click',
      (searchStr) => {
        this.historySelectClick(searchStr);
      }
    );
    this.bus.subscribe('page.history.up.click',
      (searchStr) => {
        this.historyUpClick(searchStr);
      }
    );
    this.bus.subscribe('page.results.select.click',
      (verseIdx) => {
        this.resultsClick(verseIdx);
      }
    );
    this.bus.subscribe('page.results.back.click',
      () => {
        this.backClick();
      }
    );
    this.bus.subscribe('page.results.filters.click',
      () => {
        this.filtersClick();
      }
    );
    this.bus.subscribe('page.results.go.click',
      (searchStr) => {
        this.goClick(searchStr);
      }
    );
    this.bus.subscribe('page.results.history.click',
      () => {
        this.historyClick();
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

}

export {
  SearchController
};
