'use strict';

import {
  getDataVerseIdx,
  removeAllChildren,
} from '../util.js';

class PageResults {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  activeBinUpdate(activeBin) {
    this.activeBin = activeBin;
    this.updateBanner();
    this.updateList();
  }

  addListeners() {
    this.input.addEventListener('keydown',
      (event) => {
        this.inputKeyDown(event);
      }
    );
    this.list.addEventListener('click',
      (event) => {
        this.listClick(event);
      }
    );
    this.nav.addEventListener('click',
      (event) => {
        this.navClick(event);
      }
    );
    this.tools.addEventListener('click',
      (event) => {
        this.toolsClick(event);
      }
    );
  }

  addVerse(verseIdx) {
    let btn = document.createElement('button');
    btn.classList.add('btn-result');
    btn.setAttribute('data-verse-idx', verseIdx);
    let resultText = document.createElement('span');
    resultText.classList.add('span-result-text');
    let acrostic = this.buildAcrosticSpan(verseIdx);
    let ref = this.buildRefSpan(verseIdx);
    let text = document.createTextNode(this.tome.verses[verseIdx]);
    resultText.appendChild(ref);
    if (acrostic) {
      resultText.appendChild(acrostic);
    }
    resultText.appendChild(text);
    btn.appendChild(resultText);
    return btn;
  }

  buildAcrosticSpan(verseIdx) {
    let acrostics = this.tome.acrostics;
    if (!acrostics) {
      return undefined;
    }
    let acrostic = acrostics[verseIdx];
    if (!acrostic) {
      return undefined;
    }
    let acrosticSpan = document.createElement('span');
    acrosticSpan.classList.add('acrostic');
    acrosticSpan.textContent = acrostic;
    return acrosticSpan;
  }

  buildRefSpan(verseIdx) {
    let refSpan = document.createElement('span');
    refSpan.classList.add('ref');
    refSpan.textContent = this.tome.refs[verseIdx].name;
    return refSpan;
  }

  filteredVerses() {
    return this.searchExp.verses.filter((verse) => {
      return verse >= this.activeBin.start && verse <= this.activeBin.end;
    });
  }

  fontSizeUpdate(fontSize) {
    if (this.fontSize) {
      this.lastFontSize = this.fontSize;
    }
    this.fontSize = fontSize;
    this.updateFontSize();
  }

  fontUpdate(font) {
    if (this.font) {
      this.lastFont = this.font;
    }
    this.font = font;
    this.updateFont();
  }

  getElements() {
    let pane = document.querySelector('.pane-search');
    this.page = pane.querySelector('.page-results');

    this.scroll = this.page.querySelector('.scroll-results');
    this.tools = this.page.querySelector('.tools-results');
    this.nav = pane.querySelector('.nav-results');

    this.list = this.scroll.querySelector('.list');

    this.banner = this.tools.querySelector('.banner-results');
    this.btnFilters = this.tools.querySelector('.btn-filters');
    this.btnHistory = this.tools.querySelector('.btn-history');

    this.btnBack = this.nav.querySelector('.btn-back');
    this.btnGo = this.nav.querySelector('.btn-search-go');
    this.input = this.nav.querySelector('.search-input');
  }

  goClick() {
    this.searchStr = this.input.value;
    this.bus.publish('page.results.go.click', this.searchStr);
  }

  initialize() {
    this.getElements();
    this.addListeners();
    this.subscribe();
    this.lastFont = null;
    this.lastFontSize = null;
  }

  inputKeyDown(event) {
    if (event.key === 'Enter') {
      this.goClick();
    }
  }

  listClick(event) {
    event.preventDefault();
    let target = event.target;
    let btn = target.closest('button');
    let verseIdx = getDataVerseIdx(btn);
    this.bus.publish('page.results.select.click', verseIdx);
  }

  navClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    switch (target) {
      case this.btnBack:
        this.bus.publish('page.results.back.click', null);
        break;
      case this.btnGo:
        this.goClick();
        break;
    }
  }

  scrollToTop() {
    this.scroll.scrollTop = 0;
  }

  searchExpUpdate(searchExp) {
    this.searchExp = searchExp;
    this.searchStr = this.searchExp.searchStr;
    this.input.value = this.searchStr;
  }

  subscribe() {
    this.bus.subscribe('font.size.update',
      (fontSize) => {
        this.fontSizeUpdate(fontSize);
      }
    );
    this.bus.subscribe('font.update',
      (font) => {
        this.fontUpdate(font);
      }
    );
    this.bus.subscribe('page.results.scroll.to.top',
      () => {
        this.scrollToTop();
      }
    );
    this.bus.subscribe('search.active.bin.update',
      (activeBin) => {
        this.activeBinUpdate(activeBin);
      }
    );
    this.bus.subscribe('search.exp.update',
      (searchExp) => {
        this.searchExpUpdate(searchExp);
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

  toolsClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    switch (target) {
      case this.btnFilters:
        this.bus.publish('page.results.filters.click', null);
        break;
      case this.btnHistory:
        this.bus.publish('page.results.history.click', null);
        break;
    }
  }

  updateBanner() {
    removeAllChildren(this.banner);
    if (this.searchExp.type === 'EMPTY') {
      this.banner.textContent = 'Enter a search expression.';
      return;
    }
    if (this.searchExp.type === 'INVALID') {
      this.banner.textContent = 'Invalid search expression.';
      return;
    }
    if (this.searchExp.tomeWords !== 'OK') {
      this.banner.textContent = this.searchExp.tomeWords;
      return;
    }
    if (this.activeBin.occurrences === 0) {
      this.banner.textContent = 'Not Found.';
      return;
    }
    let citation;
    if (this.activeBin.chapterIdx === null) {
      citation = this.activeBin.name;
    } else {
      citation = this.tome.chapters[this.activeBin.chapterIdx].chapterName;
    }
    let times = this.activeBin.occurrences > 1 ?
      `${this.activeBin.occurrences} times in ` :
      '1 time in ';
    let verses = this.activeBin.verses > 1 ?
      `${this.activeBin.verses} verses` :
      '1 verse';
    this.banner.innerHTML =
      `${citation}<br>${times}${verses}`;
  }

  updateFont() {
    if (this.lastFont) {
      this.list.classList.remove(this.lastFont.fontClass);
    }
    this.list.classList.add(this.font.fontClass);
  }

  updateFontSize() {
    if (this.lastFontSize) {
      this.list.classList.remove(this.lastFontSize);
    }
    this.list.classList.add(this.fontSize);
  }

  updateList() {
    removeAllChildren(this.list);
    if (this.searchExp.state !== 'OK') {
      return;
    }
    let fragment = document.createDocumentFragment();
    let verses = this.filteredVerses();
    verses.forEach((verseIdx) => {
      let verse = this.addVerse(verseIdx);
      fragment.appendChild(verse);
    });
    this.list.appendChild(fragment);
  }

}

export {
  PageResults
};
