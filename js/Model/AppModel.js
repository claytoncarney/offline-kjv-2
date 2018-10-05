'use strict';

import {
  Archive
} from '../tome/Archive.js';

class AppModel {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  initialize() {
    this.archive = new Archive();
    this.subscribe();
  }

  panesChange(panes) {
    this.panes = panes;
    this.bus.publish('panes.update', this.panes);
  }

  sidebarChange(sidebar) {
    this.sidebar = sidebar;
    this.sidebarSave();
    this.bus.publish('sidebar.update', this.sidebar);
  }

  sidebarGet() {
    let sidebar;
    let value = localStorage.getItem('sidebar');
    if (!value) {
      sidebar = this.panes > 1 ? 'contents' : 'none';
    } else {
      sidebar = JSON.parse(value);
    }
    this.sidebarChange(sidebar);
  }

  sidebarSave() {
    localStorage.setItem('sidebar', JSON.stringify(this.sidebar));
  }

  subscribe() {
    this.bus.subscribe('sidebar.change',
      (sidebar) => {
        this.sidebarChange(sidebar);
      }
    );
    this.bus.subscribe('sidebar.get',
      () => {
        this.sidebarGet();
      }
    );
    this.bus.subscribe('panes.change',
      (panes) => {
        this.panesChange(panes);
      }
    );
    this.bus.subscribe('tome.change',
      (tomeName) => {
        this.tomeChange(tomeName);
      }
    );
    this.bus.subscribe('tome.get',
      () => {
        this.tomeGet();
      }
    );
  }

  tomeChange(tomeName) {
    this.tomeName = tomeName;
    this.tomeNameSave();
    this.tome = this.archive.tomes[tomeName];
    this.bus.publish('tome.update', this.tome);
    this.bus.publish('bookmarks.get', null);
    this.bus.publish('search.get', null);
    this.bus.publish('contents.get', null);
  }

  tomeGet() {
    let tomeName;
    let value = localStorage.getItem('tomeName');
    if (!value) {
      tomeName = 'KJV';
    } else {
      tomeName = JSON.parse(value);
    }
    this.tomeChange(tomeName);
  }

  tomeNameSave() {
    localStorage.setItem('tomeName', JSON.stringify(this.tomeName));
  }

}

export {
  AppModel
};
