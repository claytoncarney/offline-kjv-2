'use strict';

import {
  activate,
  centerScrollElement,
  deactivate,
  getDataBookIdx,
  getDataChapterIdx,
  getDataChapterName,
  removeAllChildren,
  show
} from '../util.js';

class PageContents {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  addListeners() {
    this.bookList.addEventListener('click',
      (event) => {
        this.bookListClick(event);
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

  bookClick(target) {
    if (target === this.activeBookBtn) {
      this.chapterList.classList.toggle('hide');
      return;
    }
    deactivate(this.activeBookBtn);
    this.activeBookBtn = target;
    let bookIdx = getDataBookIdx(this.activeBookBtn);
    this.updateChapterList(bookIdx);
    activate(this.activeBookBtn);
    this.activeBookBtn.parentNode.insertBefore(
      this.chapterList, this.activeBookBtn.nextSibling
    );
    show(this.chapterList);
    this.bus.publish('page.contents.book.click', bookIdx);
  }

  bookListClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target.classList.contains('btn-book')) {
      this.bookClick(target);
      return;
    }
    if (target.classList.contains('btn-chapter')) {
      this.chapterClick(target);
      return;
    }
  }

  buildBookBtn(book) {
    let btn = document.createElement('button');
    btn.classList.add('btn-book');
    btn.setAttribute('data-book-idx', book.bookIdx);
    btn.textContent = book.bookName;
    return btn;
  }

  buildChapterBtn(chapter) {
    let btn = document.createElement('button');
    btn.classList.add('btn-chapter');
    btn.setAttribute('data-book-idx', chapter.bookIdx);
    btn.setAttribute('data-chapter-idx', chapter.chapterIdx);
    btn.setAttribute('data-chapter-name', chapter.chapterName);
    btn.textContent = (chapter.chapterNum).toString();
    return btn;
  }

  chapterUpdate(chapter) {
    if (
      this.chapter &&
      this.chapter.chapterIdx === chapter.chapterIdx
    ) {
      return;
    }
    this.chapter = chapter;
    this.updateActiveBook();
    this.updateChapterList(this.chapter.bookIdx);
    this.moveChapterList();
    this.updateActiveChapter();
    this.contentsScrollChapter();
  }

  chapterClick(target) {
    if (target === this.activeChapterBtn) {
      return;
    }
    if (this.activeChapterBtn) {
      deactivate(this.activeChapterBtn);
    }
    this.activeChapterBtn = target;
    let bookIdx = getDataBookIdx(target);
    let chapterIdx = getDataChapterIdx(target);
    let chapterName = getDataChapterName(target);
    activate(this.activeChapterBtn);
    let chapter = {
      bookIdx: bookIdx,
      chapterIdx: chapterIdx,
      chapterName: chapterName
    };
    this.bus.publish('page.contents.chapter.click', chapter);
  }

  contentsScrollBook() {
    if (this.chapterList.classList.contains('hide')) {
      this.chapterList.classList.remove('hide');
    }
    if (this.activeBookBtn) {
      centerScrollElement(this.scroll, this.activeBookBtn);
    }
  }

  contentsScrollChapter() {
    if (this.chapterList.classList.contains('hide')) {
      this.chapterList.classList.remove('hide');
    }
    if (this.activeChapterBtn) {
      centerScrollElement(this.scroll, this.activeChapterBtn);
    }
  }

  contentsShow() {
    this.resetContents();
    this.contentsScrollChapter();
  }

  getElements() {
    let pane = document.querySelector('.pane-contents');
    this.page = pane.querySelector('.page-contents');

    this.tools = this.page.querySelector('.tools-contents');
    this.scroll = this.page.querySelector('.scroll-contents');
    this.nav = this.page.querySelector('.nav-contents');

    this.bookList = this.scroll.querySelector('.book-list');
    this.chapterList = this.scroll.querySelector('.chapter-list');

    this.banner = this.tools.querySelector('.banner-contents');
    this.btnTomes = this.tools.querySelector('.btn-tomes');

    this.btnBack = this.nav.querySelector('.btn-back');
  }

  initialize() {
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  moveChapterList() {
    this.activeBookBtn.parentNode.insertBefore(
      this.chapterList, this.activeBookBtn.nextSibling
    );
  }

  navClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      this.bus.publish('page.contents.back.click', null);
    }
  }

  resetContents() {
    if (!this.activeBookBtn) {
      return;
    }
    let activeBookIdx = getDataBookIdx(this.activeBookBtn);
    if (activeBookIdx === this.chapter.bookIdx) {
      return;
    }
    this.updateActiveBook();
    this.updateChapterList(this.chapter.bookIdx);
    this.moveChapterList();
    this.updateActiveChapter();
  }

  subscribe() {
    this.bus.subscribe('chapter.update',
      (chapter) => {
        this.chapterUpdate(chapter);
      }
    );
    this.bus.subscribe('page.contents.show',
      () => {
        this.contentsShow();
      }
    );
    this.bus.subscribe('contents.scroll.book',
      () => {
        this.contentsScrollBook();
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
    this.updateBanner();
    this.updateBookList();
  }

  toolsClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnTomes) {
      this.bus.publish('page.contents.tomes.click', null);
    }
  }

  updateBanner() {
    this.banner.innerHTML = this.tome.name;
  }

  updateActiveBook() {
    if (this.activeBookBtn) {
      deactivate(this.activeBookBtn);
    }
    this.activeBookBtn = this.bookList
      .querySelector(`button[data-book-idx="${this.chapter.bookIdx}"]`);
    activate(this.activeBookBtn);
  }

  updateActiveChapter() {
    if (this.activeChapterBtn) {
      deactivate(this.activeChapterBtn);
    }
    this.activeChapterBtn = this.chapterList
      .querySelector(`button[data-chapter-idx="${this.chapter.chapterIdx}"]`);
    activate(this.activeChapterBtn);
  }

  updateBookList() {
    removeAllChildren(this.bookList);
    let btn;
    let fragment = document.createDocumentFragment();
    this.tome.books.forEach((book) => {
      btn = this.buildBookBtn(book);
      fragment.appendChild(btn);
    });
    this.bookList.appendChild(fragment);
  }

  updateChapterList(bookIdx) {
    removeAllChildren(this.chapterList);
    let fragment = document.createDocumentFragment();
    let book = this.tome.books[bookIdx];
    for (let idx = book.firstChapterIdx; idx <= book.lastChapterIdx; idx++) {
      let btn = this.buildChapterBtn(this.tome.chapters[idx]);
      fragment.appendChild(btn);
    }
    this.chapterList.appendChild(fragment);
  }

}

export {
  PageContents
};
