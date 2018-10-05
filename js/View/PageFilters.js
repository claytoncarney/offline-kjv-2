'use strict';

import {
  activate,
  deactivate,
  removeAllChildren,
  getDataBookIdx
} from '../util.js';

class PageFilters {

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

  bookClick(entry) {
    if (entry.classList.contains('folded')) {
      this.unfoldBook(entry);
    } else {
      this.foldBook(entry);
    }
    this.toggleEntry(entry);
  }

  buildBookEntry(book) {
    let entry = document.createElement('div');
    entry.classList.add('entry-filters-book', 'folded');
    entry.setAttribute('data-book-idx', book.bookIdx);
    let btnEntry = document.createElement('button');
    btnEntry.classList.add('btn-filters-book');
    btnEntry.textContent = `${book.name}: ${book.occurrences} / ${book.verses}`;
    entry.appendChild(btnEntry);
    let btnFilter = this.buildBtnFilter();
    btnFilter.setAttribute('data-book-idx', book.bookIdx);
    btnFilter.setAttribute('data-chapter-idx', book.chapterIdx);
    entry.appendChild(btnFilter);
    return entry;
  }

  buildBtnFilter() {
    let span = document.createElement('span');
    span.classList.add('glyph');
    let btnFilter = document.createElement('button');
    btnFilter.classList.add('btn-filter');
    btnFilter.setAttribute('aria-label', 'Filter');
    btnFilter.appendChild(span);
    return btnFilter;
  }

  buildChapterEntry(book, chapter) {
    let entry = document.createElement('div');
    entry.classList.add('entry-filters-chapter', 'hide');
    entry.setAttribute('data-book-idx', book.bookIdx);
    let btnEntry = document.createElement('button');
    btnEntry.classList.add('btn-filters-chapter');
    btnEntry.textContent =
      `${chapter.name}: ${chapter.occurrences} / ${chapter.verses}`;
    entry.appendChild(btnEntry);
    let btnFilter = this.buildBtnFilter();
    btnFilter.setAttribute('data-book-idx', chapter.bookIdx);
    btnFilter.setAttribute('data-chapter-idx', chapter.chapterIdx);
    entry.appendChild(btnFilter);
    return entry;
  }

  buildFilters() {
    let fragment = document.createDocumentFragment();
    let tome = this.searchExp.bins;
    let tomeEntry = this.buildTomeEntry(tome);
    fragment.appendChild(tomeEntry);
    tome.books.forEach((book) => {
      let bookEntry = this.buildBookEntry(book);
      fragment.appendChild(bookEntry);
      book.chapters.forEach((chapter) => {
        let chapterEntry = this.buildChapterEntry(book, chapter);
        fragment.appendChild(chapterEntry);
      });
    });
    return fragment;
  }

  buildTomeEntry(tome) {
    let entry = document.createElement('div');
    entry.classList.add('entry-filters-tome', 'unfolded');
    let btnEntry = document.createElement('button');
    btnEntry.classList.add('btn-filters-tome');
    btnEntry.textContent = `${tome.name}: ${tome.occurrences} / ${tome.verses}`;
    entry.appendChild(btnEntry);
    let btnFilter = this.buildBtnFilter();
    btnFilter.setAttribute('data-book-idx', tome.bookIdx);
    btnFilter.setAttribute('data-chapter-idx', tome.chapterIdx);
    entry.appendChild(btnFilter);
    return entry;
  }

  expUpdate(searchExp) {
    this.searchExp = searchExp;
    this.updateBanner();
    this.updateList();
  }

  filterClick(target) {
    let searchFilter = this.getFilter(target);
    this.bus.publish('page.filters.select.click', searchFilter);
  }

  filtersShow() {
    if (this.scrollReset) {
      this.scroll.scrollTop = 0;
      this.scrollReset = false;
    }
  }

  filterUpdate(searchFilter) {
    this.searchFilter = searchFilter;
    this.getActiveBin();
    if (this.searchFilter) {
      if (this.activeFilterBtn) {
        deactivate(this.activeFilterBtn);
      }
      this.activeFilterBtn = this.list.querySelector(
        `button[data-book-idx="${this.searchFilter.bookIdx}"]` +
        `[data-chapter-idx="${this.searchFilter.chapterIdx}"`
      );
      if (this.activeFilterBtn) {
        activate(this.activeFilterBtn);
      }
    }
  }

  foldAllBooks() {
    let unfoldedBooks = this.list.querySelectorAll('.entry-filters-book.unfolded');
    unfoldedBooks.forEach((book) => {
      book.classList.remove('unfolded');
      book.classList.add('folded');
    });
  }

  foldBook(entry) {
    let bookIdx = getDataBookIdx(entry);
    let chapters = this.list.querySelectorAll(
      `.entry-filters-chapter[data-book-idx="${bookIdx}"]`
    );
    chapters.forEach((chapter) => {
      chapter.classList.add('hide');
    });
  }

  foldTome() {
    this.hideAllChapters();
    this.foldAllBooks();
    this.hideAllBooks();
  }

  getActiveBin() {
    if (!this.searchFilter) {
      this.activeBin = null;
      this.bus.publish('search.active.bin.update', this.activeBin);
      return;
    }
    if (this.searchFilter.bookIdx === null) {
      if (this.searchFilter.chapterIdx === null) {
        this.activeBin = this.searchExp.bins;
      } else {
        let bookLookup =
          this.tome.chapters[this.searchFilter.chapterIdx].bookIdx;
        let bookBin = this.searchExp.bins.books.find((bin) => {
          return bin.bookIdx === bookLookup;
        });
        let chapterBin = bookBin.chapters.find((bin) => {
          return bin.chapterIdx === this.searchFilter.chapterIdx;
        });
        this.activeBin = chapterBin;
      }
    } else {
      let bookBin = this.searchExp.bins.books.find((bin) => {
        return bin.bookIdx === this.searchFilter.bookIdx;
      });
      this.activeBin = bookBin;
    }
    this.bus.publish('search.active.bin.update', this.activeBin);
  }

  getElements() {
    let pane = document.querySelector('.pane-search');
    this.page = pane.querySelector('.page-filters');

    this.scroll = this.page.querySelector('.scroll-filters');
    this.tools = this.page.querySelector('.tools-filters');
    this.nav = this.page.querySelector('.nav-filters');

    this.list = this.scroll.querySelector('.list');

    this.banner = this.tools.querySelector('.banner-filters');

    this.btnBack = this.nav.querySelector('.btn-back');
  }

  getFilter(btn) {
    let bookIdx = btn.getAttribute('data-book-idx');
    let chapterIdx = btn.getAttribute('data-chapter-idx');
    let seachFilter = {
      bookIdx: bookIdx === 'null' ? null : parseInt(bookIdx),
      chapterIdx: chapterIdx === 'null' ? null : parseInt(chapterIdx)
    };
    return seachFilter;
  }

  hideAllBooks() {
    let books = this.list.querySelectorAll('.entry-filters-book');
    books.forEach((book) => {
      book.classList.add('hide');
    });
  }

  hideAllChapters() {
    let chapters = this.list.querySelectorAll('.entry-filters-chapter');
    chapters.forEach((chapter) => {
      chapter.classList.add('hide');
    });
  }

  initialize() {
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  listClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target.classList.contains('btn-filter')) {
      this.filterClick(target);
      return;
    }
    let entry = target.closest('div');
    if (target.classList.contains('btn-filters-tome')) {
      this.tomeClick(entry);
      return;
    }
    if (target.classList.contains('btn-filters-book')) {
      this.bookClick(entry);
      return;
    }
  }

  navClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      this.bus.publish('page.filters.back.click', null);
      return;
    }
  }

  scrollToTop() {
    if (this.page.classList.contains('hide')) {
      this.scrollReset = true;
      return;
    }
    this.scroll.scrollTop = 0;
  }

  subscribe() {
    this.bus.subscribe('page.filters.scroll.to.top',
      () => {
        this.scrollToTop();
      }
    );
    this.bus.subscribe('page.filters.show',
      () => {
        this.filtersShow();
      }
    );
    this.bus.subscribe('search.exp.update',
      (searchExp) => {
        this.expUpdate(searchExp);
      }
    );
    this.bus.subscribe('search.filter.update',
      (searchFilter) => {
        this.filterUpdate(searchFilter);
      }
    );
    this.bus.subscribe('tome.update',
      (tome) => {
        this.tomeUpdate(tome);
      }
    );
  }

  toggleEntry(entry) {
    if (entry.classList.contains('folded')) {
      entry.classList.remove('folded');
      entry.classList.add('unfolded');
    } else {
      entry.classList.remove('unfolded');
      entry.classList.add('folded');
    }
  }

  tomeUpdate(tome) {
    this.tome = tome;
  }

  tomeClick(entry) {
    if (entry.classList.contains('folded')) {
      this.unfoldTome();
    } else {
      this.foldTome();
    }
    this.toggleEntry(entry);
  }

  unfoldBook(entry) {
    let bookIdx = getDataBookIdx(entry);
    let chapters = this.list.querySelectorAll(
      `.entry-filters-chapter[data-book-idx="${bookIdx}"]`
    );
    chapters.forEach((chapter) => {
      chapter.classList.remove('hide');
    });
  }

  unfoldTome() {
    let books = this.list.querySelectorAll('.entry-filters-book');
    books.forEach((book) => {
      book.classList.remove('hide');
    });
  }

  updateBanner() {
    this.banner.innerHTML = `Search Filters:<br>${this.searchExp.searchStr}`;
  }

  updateList() {
    removeAllChildren(this.list);
    if (this.searchExp.state !== 'OK') {
      return;
    }
    let list = this.buildFilters();
    this.list.appendChild(list);
  }

}

export {
  PageFilters
};
