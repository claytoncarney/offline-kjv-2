'use strict';

class HelpModel {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  fontChange(font) {
    this.font = font;
    this.fontSave();
    this.bus.publish('font.update', this.font);
  }

  fontGet() {
    let value = localStorage.getItem('font');
    if (!value) {
      this.font = {
        fontName: 'Roboto',
        fontClass: 'font-roboto'
      };
      this.fontSave();
    } else {
      this.font = JSON.parse(value);
    }
    this.bus.publish('font.update', this.font);
  }

  fontSave() {
    localStorage.setItem('font', JSON.stringify(this.font));
  }

  fontsGet() {
    this.fonts = [];
    this.fonts.push({
      fontName: 'Roboto',
      fontClass: 'font-roboto'
    });
    this.fonts.push({
      fontName: 'Open Sans',
      fontClass: 'font-open-sans'
    });
    this.fonts.push({
      fontName: 'Lato',
      fontClass: 'font-lato'
    });
    this.fonts.push({
      fontName: 'Slabo',
      fontClass: 'font-slabo'
    });
    this.fonts.push({
      fontName: 'Merriweather',
      fontClass: 'font-merriweather'
    });
    this.fonts.push({
      fontName: 'Roboto Slab',
      fontClass: 'font-roboto-slab'
    });
    this.bus.publish('fonts.update', this.fonts);
  }

  fontSizeChange(fontSize) {
    this.fontSize = fontSize;
    this.fontSizeSave();
    this.bus.publish('font.size.update', this.fontSize);
  }

  fontSizeGet() {
    let value = localStorage.getItem('fontSize');
    if (!value) {
      this.fontSize = 'font-size-m';
      this.fontSizeSave();
    } else {
      this.fontSize = JSON.parse(value);
    }
    this.bus.publish('font.size.update', this.fontSize);
  }

  fontSizeSave() {
    localStorage.setItem('fontSize', JSON.stringify(this.fontSize));
  }

  initialize() {
    this.subscribe();
  }

  subscribe() {
    this.bus.subscribe('font.change',
      (font) => {
        this.fontChange(font);
      }
    );
    this.bus.subscribe('font.get',
      () => {
        this.fontGet();
      }
    );
    this.bus.subscribe('font.size.change',
      (fontSize) => {
        this.fontSizeChange(fontSize);
      }
    );
    this.bus.subscribe('font.size.get',
      () => {
        this.fontSizeGet();
      }
    );
    this.bus.subscribe('fonts.get',
      () => {
        this.fontsGet();
      }
    );
    this.bus.subscribe('theme.change',
      (theme) => {
        this.themeChange(theme);
      }
    );
    this.bus.subscribe('theme.get',
      () => {
        this.themeGet();
      }
    );
    this.bus.subscribe('themes.get',
      () => {
        this.themesGet();
      }
    );
  }

  themeChange(theme) {
    this.theme = theme;
    this.themeSave();
    this.bus.publish('theme.update', this.theme);
  }

  themeGet() {
    let value = localStorage.getItem('theme');
    if (!value) {
      this.theme = {
        themeName: 'Day',
        themeClass: 'theme-day'
      };
      this.themeSave();
    } else {
      this.theme = JSON.parse(value);
    }
    this.bus.publish('theme.update', this.theme);
  }

  themeSave() {
    localStorage.setItem('theme', JSON.stringify(this.theme));
  }

  themesGet() {
    this.themes = [];
    this.themes.push({
      themeName: 'Day',
      themeClass: 'theme-day'
    });
    this.themes.push({
      themeName: 'Indigo',
      themeClass: 'theme-indigo'
    });
    this.themes.push({
      themeName: 'Night',
      themeClass: 'theme-night'
    });
    this.bus.publish('themes.update', this.themes);
  }

}

export {
  HelpModel
};
