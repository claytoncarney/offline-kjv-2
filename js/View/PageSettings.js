'use strict';

class PageSettings {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  addListeners() {
    this.nav.addEventListener('click',
      (event) => {
        this.navClick(event);
      }
    );
    this.scroll.addEventListener('click',
      (event) => {
        this.scrollClick(event);
      });
  }

  fontSizeUpdate(fontSize) {
    this.fontSize = fontSize;
    this.updateFontSizeBtn();
    this.updateFontSize();
    this.lastFontSize = this.fontSize;
  }

  fontUpdate(font) {
    this.font = font;
    this.updateFontName();
    this.updateFont();
    this.lastFont = this.font;
  }

  getElements() {
    let pane = document.querySelector('.pane-help');
    this.page = pane.querySelector('.page-settings');

    this.nav = this.page.querySelector('.nav-settings');
    this.scroll = this.page.querySelector('.scroll-settings');
    this.tools = this.page.querySelector('.tools-settings');

    this.navFont = this.scroll.querySelector('.nav-font');
    this.spanFontName = this.navFont.querySelector('.font-name');
    this.btnFontNext = this.navFont.querySelector('.btn-font-next');
    this.btnFontPrev = this.navFont.querySelector('.btn-font-prev');

    this.navFontSize = this.scroll.querySelector('.nav-font-size');

    this.navTheme = this.scroll.querySelector('.nav-theme');
    this.spanThemeName = this.navTheme.querySelector('.theme-name');
    this.btnThemeNext = this.navTheme.querySelector('.btn-theme-next');
    this.btnThemePrev = this.navTheme.querySelector('.btn-theme-prev');

    this.fontSample = this.scroll.querySelector('.font-sample');

    this.btnBack = this.nav.querySelector('.btn-back');
  }

  initialize() {
    this.getElements();
    this.addListeners();
    this.subscribe();
    this.lastFont = null;
    this.lastFontSize = null;
    this.lastTheme = null;
  }

  navClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      this.bus.publish('page.settings.back.click', null);
    }
  }

  navFontClick(target) {
    let btn = target.closest('button');
    if (!btn) {
      return;
    }
    switch (btn) {
      case this.btnFontPrev:
        this.bus.publish('page.settings.font.prev.click', null);
        break;
      case this.btnFontNext:
        this.bus.publish('page.settings.font.next.click', null);
        break;
    }
  }

  navFontSizeClick(target) {
    if (target.classList.contains('btn-font-size')) {
      let dataSize = target.getAttribute('data-size');
      this.bus.publish('page.settings.font.size.click', dataSize);
    }
  }

  navThemeClick(target) {
    let btn = target.closest('button');
    if (!btn) {
      return;
    }
    switch (btn) {
      case this.btnThemePrev:
        this.bus.publish('page.settings.theme.prev.click', null);
        break;
      case this.btnThemeNext:
        this.bus.publish('page.settings.theme.next.click', null);
        break;
    }
  }

  panesUpdate(panes) {
    this.panes = panes;
    this.updateFontSample();
  }

  scrollClick(event) {
    event.preventDefault();
    let target = event.target;
    if (this.navFont.contains(target)) {
      this.navFontClick(target);
      return;
    }
    if (this.navFontSize.contains(target)) {
      this.navFontSizeClick(target);
      return;
    }
    if (this.navTheme.contains(target)) {
      this.navThemeClick(target);
      return;
    }
  }

  settingsShow() {
    this.updateFontSample();
  }

  subscribe() {
    this.bus.subscribe('font.update',
      (font) => {
        this.fontUpdate(font);
      }
    );
    this.bus.subscribe('font.size.update',
      (fontSize) => {
        this.fontSizeUpdate(fontSize);
      }
    );
    this.bus.subscribe('page.settings.show',
      () => {
        this.settingsShow();
      }
    );
    this.bus.subscribe('theme.update',
      (theme) => {
        this.themeUpdate(theme);
      }
    );
    this.bus.subscribe('panes.update',
      (panes) => {
        this.panesUpdate(panes);
      }
    );
  }

  themeUpdate(theme) {
    this.theme = theme;
    this.updateThemeName();
    this.lastTheme = this.theme;
  }

  updateFont() {
    if (this.lastFont) {
      this.navFontSize.classList.remove(this.lastFont.fontClass);
      this.fontSample.classList.remove(this.lastFont.fontClass);
    }
    this.navFontSize.classList.add(this.font.fontClass);
    this.fontSample.classList.add(this.font.fontClass);
  }

  updateFontName() {
    this.spanFontName.innerText = this.font.fontName;
    this.updateFont(this.fontName);
  }

  updateFontSample() {
    if (this.panes === 1) {
      this.fontSample.classList.remove('hide');
    } else {
      this.fontSample.classList.add('hide');
    }
  }

  updateFontSize() {
    if (this.lastFontSize) {
      this.fontSample.classList.remove(this.lastFontSize);
    }
    this.fontSample.classList.add(this.fontSize);
  }

  updateFontSizeBtn() {
    if (this.activeFontSizeBtn) {
      this.activeFontSizeBtn.classList.remove('active');
    }
    this.activeFontSizeBtn = this.navFontSize.querySelector(
      `button[data-size="${this.fontSize}"]`
    );
    this.activeFontSizeBtn.classList.add('active');
  }

  updateThemeName() {
    this.spanThemeName.innerText = this.theme.themeName;
  }

}

export {
  PageSettings
};
