'use strict';

import {
  activate,
  centerScrollElement,
  deactivate,
  getDataVerseIdx,
  removeAllChildren
} from '../util.js';

class PageRead {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  addListeners() {
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
  }

  bookmarksUpdate(bookmarksFolder) {
    this.bookmarksFolder = bookmarksFolder;
    this.refreshVerseBookmarks();
  }

  buildAcrosticSpan(verseIdx) {
    let acrostics = this.tome.acrostics;
    let acrostic = acrostics[verseIdx];
    if (!acrostic) {
      return undefined;
    }
    let acrosticSpan = document.createElement('span');
    acrosticSpan.classList.add('acrostic');
    acrosticSpan.textContent = acrostic;
    return acrosticSpan;
  }

  buildAcrosticText(verseIdx) {
    let acrostics = this.tome.acrostics;
    let acrostic = acrostics[verseIdx];
    if (!acrostic) {
      return undefined;
    }
    return acrostic;
  }

  buildBtnVerseNum(verseIdx) {
    let btn = document.createElement('button');
    btn.classList.add('btn-verse-num');
    let span = document.createElement('span');
    span.classList.add('span-verse-num');
    span.textContent = this.tome.refs[verseIdx].verseNum;
    btn.appendChild(span);
    return btn;
  }

  buildBtnVerseText(verseIdx) {
    let btn = document.createElement('button');
    btn.classList.add('btn-verse-text');
    let span = document.createElement('span');
    span.classList.add('span-verse-text');
    let acrostic = this.buildAcrosticSpan(verseIdx);
    if (acrostic) {
      span.innerHTML = acrostic.outerHTML;
    }
    span.innerHTML += this.tome.verses[verseIdx];
    btn.appendChild(span);
    return btn;
  }

  buildClipboardText(verseIdx) {
    let text = this.buildRefText(verseIdx);
    let acrostic = this.buildAcrosticText(verseIdx);
    if (acrostic) {
      text += ' ' + acrostic;
    }
    return text + ' ' + this.buildVerseText(verseIdx);
  }

  buildRefText(verseIdx) {
    return this.tome.refs[verseIdx].name;
  }

  buildVerse(verseIdx) {
    let entry = document.createElement('div');
    entry.setAttribute('data-verse-idx', verseIdx);
    entry.classList.add('entry-verse');
    let btnVerseNum = this.buildBtnVerseNum(verseIdx);
    entry.appendChild(btnVerseNum);
    let btnVerseText = this.buildBtnVerseText(verseIdx);
    entry.appendChild(btnVerseText);
    return entry;
  }

  buildVerseText(verseIdx) {
    return this.tome.verses[verseIdx];
  }

  chapterUpdate(chapter) {
    this.chapter = chapter;
    this.updateVerses();
  }

  columnsUpdate(columns) {
    this.columns = columns;
    this.updateColumns();
    this.updateColumnsBtn();
  }

  copyToClipboard(verseIdx) {
    this.binCopy.value = this.buildClipboardText(verseIdx);
    this.binCopy.select();
    document.execCommand('copy');
  }

  fontSizeUpdate(fontSize) {
    this.fontSize = fontSize;
    this.updateFontSize();
    this.lastFontSize = this.fontSize;
  }

  fontUpdate(font) {
    this.font = font;
    this.updateFont();
    this.lastFont = this.font;
  }

  getElements() {
    this.binCopy = document.querySelector('.bin-copy');

    let pane = document.querySelector('.pane-read');
    this.page = pane.querySelector('.page-read');

    this.scroll = this.page.querySelector('.scroll-read');

    this.list = this.scroll.querySelector('.list');

    this.nav = pane.querySelector('.nav-read');
    this.btnColumnsOne = this.nav.querySelector('.btn-columns-1');
    this.btnColumnsTwo = this.nav.querySelector('.btn-columns-2');
    this.btnColumnsThree = this.nav.querySelector('.btn-columns-3');

    this.columnsBtns = [
      this.btnColumnsOne, this.btnColumnsTwo, this.btnColumnsThree
    ];
  }

  initialize() {
    this.getElements();
    this.addListeners();
    this.subscribe();
    this.lastFont = null;
    this.lastFontSize = null;
  }

  listClick(event) {
    event.preventDefault();
    let entry = event.target.closest('div.entry-verse');
    let btn = event.target.closest('button');
    if (btn.classList.contains('btn-verse-num')) {
      this.verseNumClick(entry);
      return;
    }
    if (btn.classList.contains('btn-verse-text')) {
      this.verseClick(entry);
      return;
    }
  }

  navClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    switch (target) {
      case this.btnColumnsOne:
        this.bus.publish('columns.click', 1);
        break;
      case this.btnColumnsTwo:
        this.bus.publish('columns.click', 2);
        break;
      case this.btnColumnsThree:
        this.bus.publish('columns.click', 3);
        break;
    }
  }

  refreshBookmarks(element) {
    let verseIdx = getDataVerseIdx(element);
    if (this.bookmarksFolder.bookmarks.indexOf(verseIdx) === -1) {
      element.classList.remove('bookmark');
    } else {
      element.classList.add('bookmark');
    }
  }

  refreshVerseBookmarks() {
    let verses = [...this.list.querySelectorAll('.entry-verse')];
    verses.forEach(
      (element) => {
        this.refreshBookmarks(element);
      }
    );
  }

  scrollToTop() {
    this.scroll.scrollTop = 0;
  }

  scrollToVerse(verseIdx) {
    let element = this.list.querySelector(
      `[data-verse-idx="${verseIdx}"]`
    );
    if (element) {
      centerScrollElement(this.scroll, element);
    }
  }

  subscribe() {
    this.bus.subscribe('bookmarks.update',
      (bookmarksFolder) => {
        this.bookmarksUpdate(bookmarksFolder);
      }
    );
    this.bus.subscribe('chapter.update',
      (chapter) => {
        this.chapterUpdate(chapter);
      }
    );
    this.bus.subscribe('columns.update',
      (columns) => {
        this.columnsUpdate(columns);
      }
    );
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
    this.bus.subscribe('page.read.scroll.to.top',
      () => {
        this.scrollToTop();
      }
    );
    this.bus.subscribe('page.read.scroll.to.verse',
      (verseIdx) => {
        this.scrollToVerse(verseIdx);
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

  updateColumnsBtn() {
    if (this.activeColumnsBtn) {
      deactivate(this.activeColumnsBtn);
    }
    this.activeColumnsBtn = this.columnsBtns[this.columns - 1];
    activate(this.activeColumnsBtn);
  }

  updateColumns() {
    this.list.classList.remove('columns-2', 'columns-3');
    if (this.columns === 2) {
      this.list.classList.add('columns-2');
      return;
    }
    if (this.columns === 3) {
      this.list.classList.add('columns-3');
      return;
    }
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

  updateVerses() {
    removeAllChildren(this.list);
    let fragment = document.createDocumentFragment();
    let chapter = this.tome.chapters[this.chapter.chapterIdx];
    for (let idx = chapter.firstVerseIdx; idx <= chapter.lastVerseIdx; idx++) {
      let verse = this.buildVerse(idx);
      fragment.appendChild(verse);
    }
    this.list.appendChild(fragment);
    this.refreshVerseBookmarks();
  }

  verseClick(entry) {
    let verseIdx = getDataVerseIdx(entry);
    if (entry.classList.contains('bookmark')) {
      this.bus.publish('verse.click.delete.bookmarks', verseIdx);
    } else {
      this.bus.publish('verse.click.add.bookmarks', verseIdx);
    }
  }

  verseNumClick(entry) {
    let verseIdx = getDataVerseIdx(entry);
    this.copyToClipboard(verseIdx);
  }

}

export {
  PageRead
};
