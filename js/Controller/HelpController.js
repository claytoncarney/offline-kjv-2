'use strict';

class HelpController {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  backClick() {
    this.bus.publish('sidebar.change', 'none');
  }

  fontNextClick() {
    this.getNextFontIdx();
    this.bus.publish('font.change', this.fonts[this.fontIdx]);
  }

  fontPrevClick() {
    this.getPrevFontIdx();
    this.bus.publish('font.change', this.fonts[this.fontIdx]);
  }

  fontSizeClick(fontSize) {
    this.fontSize = fontSize;
    this.bus.publish('font.size.change', this.fontSize);
  }

  fontUpdate(font) {
    this.font = font;
    if (!this.fontIdx) {
      this.fontIdx = this.fonts.findIndex((font) => {
        return font.fontName === this.font.fontName;
      });
    }
  }

  fontsUpdate(fonts) {
    this.fonts = fonts;
    this.maxFontIdx = this.fonts.length - 1;
  }

  getNextFontIdx() {
    this.fontIdx = this.fontIdx === this.maxFontIdx ? 0 : this.fontIdx += 1;
  }

  getPrevFontIdx() {
    this.fontIdx = this.fontIdx === 0 ? this.maxFontIdx : this.fontIdx -= 1;
  }

  getNextThemeIdx() {
    this.themeIdx = this.themeIdx === this.maxThemeIdx ? 0 : this.themeIdx += 1;
  }

  getPrevThemeIdx() {
    this.themeIdx = this.themeIdx === 0 ? this.maxThemeIdx : this.themeIdx -= 1;
  }

  initialize() {
    this.subscribe();
    this.topic = 'Overview';
    this.bus.publish('help.topic.show', this.topic);
  }

  settingsBackClick() {
    this.bus.publish('page.settings.hide', null);
    this.bus.publish('page.help.show', null);
  }

  settingsClick() {
    this.bus.publish('page.help.hide', null);
    this.bus.publish('page.settings.show', null);
  }

  subscribe() {
    this.bus.subscribe('font.update',
      (font) => {
        this.fontUpdate(font);
      }
    );
    this.bus.subscribe('fonts.update',
      (fonts) => {
        this.fontsUpdate(fonts);
      }
    );
    this.bus.subscribe('page.help.back.click',
      () => {
        this.backClick();
      }
    );
    this.bus.subscribe('page.help.settings.click',
      () => {
        this.settingsClick();
      }
    );
    this.bus.subscribe('page.help.topics.click',
      (topic) => {
        this.topicsClick(topic);
      }
    );
    this.bus.subscribe('page.topics.back.click',
      (topic) => {
        this.topicsBackClick(topic);
      }
    );
    this.bus.subscribe('page.topics.topic.click',
      (topic) => {
        this.topicClick(topic);
      }
    );
    this.bus.subscribe('page.settings.back.click',
      () => {
        this.settingsBackClick();
      }
    );
    this.bus.subscribe('page.settings.font.next.click',
      () => {
        this.fontNextClick();
      }
    );
    this.bus.subscribe('page.settings.font.prev.click',
      () => {
        this.fontPrevClick();
      }
    );
    this.bus.subscribe('page.settings.font.size.click',
      (fontSize) => {
        this.fontSizeClick(fontSize);
      }
    );
    this.bus.subscribe('page.settings.theme.next.click',
      () => {
        this.themeNextClick();
      }
    );
    this.bus.subscribe('page.settings.theme.prev.click',
      () => {
        this.themePrevClick();
      }
    );
    this.bus.subscribe('theme.update',
      (theme) => {
        this.themeUpdate(theme);
      }
    );
    this.bus.subscribe('themes.update',
      (themes) => {
        this.themesUpdate(themes);
      }
    );
  }

  themeNextClick() {
    this.getNextThemeIdx();
    this.bus.publish('theme.change', this.themes[this.themeIdx]);
  }

  themePrevClick() {
    this.getPrevThemeIdx();
    this.bus.publish('theme.change', this.themes[this.themeIdx]);
  }

  themeUpdate(theme) {
    this.theme = theme;
    if (!this.themeIdx) {
      this.themeIdx = this.themes.findIndex((theme) => {
        return theme.themeName === this.theme.themeName;
      });
    }
  }

  themesUpdate(themes) {
    this.themes = themes;
    this.maxThemeIdx = this.themes.length - 1;
  }

  topicClick(topic) {
    this.bus.publish('page.topics.hide', null);
    this.bus.publish('page.help.show', null);
    this.bus.publish('help.topic.hide', this.topic);
    this.topic = topic;
    this.bus.publish('help.topic.show', this.topic);
  }

  topicsBackClick() {
    this.bus.publish('page.topics.hide', null);
    this.bus.publish('page.help.show', null);
  }

  topicsClick() {
    this.bus.publish('page.help.hide', null);
    this.bus.publish('page.topics.show', null);
  }

}

export {
  HelpController
};
