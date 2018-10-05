'use strict';

import {
  SearchEngine
} from '../SearchEngine.js';

class SearchModel {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  filterChange(searchFilter) {
    this.entry.searchFilter = searchFilter;
    this.searchDepotSave();
    this.bus.publish('search.filter.update', this.entry.searchFilter);
  }

  getEntry() {
    let entry = this.searchDepot.find((entry) => {
      return entry.tomeName === this.tome.name;
    });
    this.entry = entry;
  }

  getSearchDepot() {
    let value = localStorage.getItem('searchDepot');
    if (!value) {
      this.searchDepot = [];
    } else {
      this.searchDepot = JSON.parse(value);
    }
    this.getEntry();
    if (!this.entry) {
      this.initilizeEntry();
      this.searchDepot.push(this.entry);
    }
  }

  historyAdd() {
    if (this.entry.searchHistory.indexOf(this.entry.searchStr) != -1) {
      return;
    }
    this.entry.searchHistory = [this.entry.searchStr, ...this.entry.searchHistory];
    this.historyChange();
  }

  historyChange() {
    this.searchDepotSave();
    this.bus.publish('page.history.update', this.entry.searchHistory);
  }

  historyDelete(str) {
    let index = this.entry.searchHistory.indexOf(str);
    this.entry.searchHistory.splice(index, 1);
    this.historyChange();
  }

  historyDown(str) {
    let index = this.entry.searchHistory.indexOf(str);
    if (index === (this.entry.searchHistory.length - 1) || index === -1) {
      return;
    }
    this.reorderHistory(index, index + 1);
    this.historyChange();
  }

  historyUp(str) {
    let index = this.entry.searchHistory.indexOf(str);
    if (index === 0 || index === -1) {
      return;
    }
    this.reorderHistory(index, index - 1);
    this.historyChange();
  }

  initialize() {
    this.engine = new SearchEngine(this.bus);
    this.subscribe();
  }

  initilizeEntry() {
    let entry = {
      tomeName: this.tome.name,
      searchStr: '',
      searchFilter: {
        bookIdx: null,
        chapterIdx: null
      },
      searchHistory: []
    };
    this.entry = entry;
  }

  initializeFilter() {
    if (this.searchExp.state === 'OK') {
      this.entry.searchFilter = {
        bookIdx: null,
        chapterIdx: null
      };
    } else {
      this.entry.searchFilter = null;
    }
  }

  publishUpdate() {
    this.bus.publish('search.exp.update', this.searchExp);
    this.bus.publish('search.filter.update', this.entry.searchFilter);
    this.bus.publish('page.history.update', this.entry.searchHistory);
  }

  reorderHistory(fromIdx, toIdx) {
    this.entry.searchHistory.splice(toIdx, 0, this.entry.searchHistory.splice(fromIdx, 1)[0]);
  }

  searchDepotSave() {
    localStorage.setItem('searchDepot', JSON.stringify(this.searchDepot));
  }

  searchGet() {
    this.getSearchDepot();
    this.searchExp = this.engine.performSearch(this.entry.searchStr);
    this.publishUpdate();
  }

  strChange(searchStr) {
    this.entry.searchStr = searchStr;
    this.updateSearchExp();
    this.searchDepotSave();
    this.publishUpdate();
  }

  subscribe() {
    this.bus.subscribe('search.filter.change',
      (searchFilter) => {
        this.filterChange(searchFilter);
      }
    );
    this.bus.subscribe('search.get',
      () => {
        this.searchGet();
      }
    );
    this.bus.subscribe('page.history.delete',
      (searchStr) => {
        this.historyDelete(searchStr);
      }
    );
    this.bus.subscribe('page.history.down',
      (searchStr) => {
        this.historyDown(searchStr);
      }
    );
    this.bus.subscribe('page.history.up',
      (searchStr) => {
        this.historyUp(searchStr);
      }
    );
    this.bus.subscribe('search.str.change',
      (searchStr) => {
        this.strChange(searchStr);
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
    this.getSearchDepot();
    this.searchDepotSave();
  }

  updateSearchExp() {
    this.searchExp = this.engine.performSearch(this.entry.searchStr);
    if (this.searchExp.state === 'OK') {
      this.historyAdd();
    }
    this.initializeFilter();
  }

}

export {
  SearchModel
};
