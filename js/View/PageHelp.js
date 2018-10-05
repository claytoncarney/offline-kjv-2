'use strict';

import {
  hide,
  show
} from '../util.js';

class PageHelp {

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
    this.tools.addEventListener('click',
      (event) => {
        this.toolsClick(event);
      }
    );
  }

  getElements() {
    let pane = document.querySelector('.pane-help');
    this.page = pane.querySelector('.page-help');

    this.nav = this.page.querySelector('.nav-help');
    this.scroll = this.page.querySelector('.scroll-help');
    this.tools = this.page.querySelector('.tools-help');

    this.banner = this.tools.querySelector('.banner-help');
    this.btnTopics = this.tools.querySelector('.btn-topics');
    this.btnSettings = this.tools.querySelector('.btn-settings');

    this.btnBack = this.nav.querySelector('.btn-back');

    this.about = this.scroll.querySelector('.topic-about');
    this.overview = this.scroll.querySelector('.topic-overview');
    this.read = this.scroll.querySelector('.topic-read');
    this.contents = this.scroll.querySelector('.topic-contents');
    this.bookmarks = this.scroll.querySelector('.topic-bookmarks');
    this.search = this.scroll.querySelector('.topic-search');
    this.help = this.scroll.querySelector('.topic-help');
    this.thatsMyKing = this.scroll.querySelector('.topic-king');

    this.helpTopics = {
      About: this.about,
      Overview: this.overview,
      Read: this.read,
      Contents: this.contents,
      Bookmarks: this.bookmarks,
      Search: this.search,
      Help: this.help,
      ThatsMyKING: this.thatsMyKing
    };
  }

  initialize() {
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  navClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      this.bus.publish('page.help.back.click', null);
    }
  }

  subscribe() {
    this.bus.subscribe('help.topic.show',
      (topic) => {
        this.topicShow(topic);
      }
    );
    this.bus.subscribe('help.topic.hide',
      (topic) => {
        this.topicHide(topic);
      }
    );
  }

  toolsClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    switch (target) {
      case this.btnSettings:
        this.bus.publish('page.help.settings.click', null);
        break;
      case this.btnTopics:
        this.bus.publish('page.help.topics.click', null);
        break;
    }
  }

  topicHide(topic) {
    hide(this.helpTopics[topic]);
  }

  topicShow(topic) {
    show(this.helpTopics[topic]);
    if (topic === 'ThatsMyKING') {
      topic = 'That\'s MY KING!';
    }
    this.banner.textContent = topic;
    this.scroll.scrollTop = 0;
  }

}

export {
  PageHelp
};
