'use strict';

import {
  activate,
  deactivate,
  hide,
  show
} from '../util.js';

class AppView {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  addListeners() {
    window.addEventListener('resize',
      () => {
        this.windowResize();
      }
    );
    this.nav.addEventListener('click',
      (event) => {
        this.navClick(event);
      }
    );
  }

  chapterUpdate(chapter) {
    this.chapter = chapter;
    this.btnContents.textContent = this.chapter.chapterName;
  }

  getElements() {
    this.body = document.querySelector('body');

    this.paneBookmarks = this.body.querySelector('.pane-bookmarks');
    this.paneContents = this.body.querySelector('.pane-contents');
    this.paneHelp = this.body.querySelector('.pane-help');
    this.paneRead = this.body.querySelector('.pane-read');
    this.paneSearch = this.body.querySelector('.pane-search');

    this.nav = this.paneRead.querySelector('.nav-read');
    this.btnBookmarks = this.nav.querySelector('.btn-bookmarks');
    this.btnContents = this.nav.querySelector('.btn-contents');
    this.btnHelp = this.nav.querySelector('.btn-help');
    this.btnSearch = this.nav.querySelector('.btn-search');
  }

  initialize() {
    this.getElements();
    this.addListeners();
    this.subscribe();
    this.lastTheme = null;
  }

  navClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    switch (target) {
      case this.btnContents:
        this.bus.publish('sidebar.click', 'contents');
        break;
      case this.btnBookmarks:
        this.bus.publish('sidebar.click', 'bookmarks');
        break;
      case this.btnSearch:
        this.bus.publish('sidebar.click', 'search');
        break;
      case this.btnHelp:
        this.bus.publish('sidebar.click', 'help');
        break;
    }
  }

  paneBookmarksHide() {
    hide(this.paneBookmarks);
    deactivate(this.btnBookmarks);
  }

  paneBookmarkShow() {
    show(this.paneBookmarks);
    activate(this.btnBookmarks);
  }

  paneContentsHide() {
    hide(this.paneContents);
    deactivate(this.btnContents);
  }

  paneContentsShow() {
    show(this.paneContents);
    activate(this.btnContents);
  }

  paneHelpHide() {
    hide(this.paneHelp);
    deactivate(this.btnHelp);
  }

  paneHelpShow() {
    show(this.paneHelp);
    activate(this.btnHelp);
  }

  paneReadHide() {
    hide(this.paneRead);
  }

  paneReadShow() {
    show(this.paneRead);
  }

  paneSearchHide() {
    hide(this.paneSearch);
    deactivate(this.btnSearch);
  }

  paneSearchShow() {
    show(this.paneSearch);
    activate(this.btnSearch);
  }

  subscribe() {
    this.bus.subscribe('chapter.update',
      (chapter) => {
        this.chapterUpdate(chapter);
      }
    );
    this.bus.subscribe('pane.bookmarks.hide',
      () => {
        this.paneBookmarksHide();
      }
    );
    this.bus.subscribe('pane.bookmarks.show',
      () => {
        this.paneBookmarkShow();
      }
    );
    this.bus.subscribe('pane.contents.hide',
      () => {
        this.paneContentsHide();
      }
    );
    this.bus.subscribe('pane.contents.show',
      () => {
        this.paneContentsShow();
      }
    );
    this.bus.subscribe('pane.help.hide',
      () => {
        this.paneHelpHide();
      }
    );
    this.bus.subscribe('pane.help.show',
      () => {
        this.paneHelpShow();
      }
    );
    this.bus.subscribe('pane.read.hide',
      () => {
        this.paneReadHide();
      }
    );
    this.bus.subscribe('pane.read.show',
      () => {
        this.paneReadShow();
      }
    );
    this.bus.subscribe('pane.search.hide',
      () => {
        this.paneSearchHide();
      }
    );
    this.bus.subscribe('pane.search.show',
      () => {
        this.paneSearchShow();
      }
    );
    this.bus.subscribe('theme.update',
      (theme) => {
        this.themeUpdate(theme);
      }
    );
  }

  themeUpdate(theme) {
    this.theme = theme;
    this.updateTheme();
    this.lastTheme = this.theme;
  }

  updateTheme() {
    if (this.lastTheme) {
      this.body.classList.remove(this.lastTheme.themeClass);
    }
    this.body.classList.add(this.theme.themeClass);
  }

  windowResize() {
    this.bus.publish('window.resize', null);
  }

}

export {
  AppView
};
