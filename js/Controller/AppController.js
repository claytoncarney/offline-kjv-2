'use strict';

class AppController {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  chapterUpdate(chapter) {
    this.chapter = chapter;
  }

  columnsUpdate(columns) {
    this.columns = columns;
  }

  decreasePanes() {
    if (this.panes === 1) {
      this.lastSidebar = this.sidebar;
      this.bus.publish('sidebar.change', 'none');
      this.bus.publish('columns.click', 1);
      return;
    }
    if (this.panes === 2) {
      this.bus.publish('columns.click', 1);
      return;
    }
    if (this.panes === 3 && this.columns > 1) {
      this.bus.publish('columns.click', 2);
      return;
    }
  }

  increasePanes() {
    if (this.currentPanes > 1) {
      return;
    }
    if (this.sidebar !== 'none') {
      this.bus.publish('pane.read.show', null);
      return;
    }
    if (this.lastSidebar === null) {
      this.bus.publish('sidebar.change', 'contents');
      return;
    }
    this.bus.publish('sidebar.change', this.lastSidebar);
    return;
  }

  initialize() {
    this.subscribe();
    this.sidebar = null;
    this.lastSidebar = null;
  }

  initializeApp() {
    this.setPanes();
    this.currentPanes = this.panes;
    this.bus.publish('sidebar.get', null);
    this.bus.publish('columns.get', null);
    this.bus.publish('fonts.get', null);
    this.bus.publish('font.get', null);
    this.bus.publish('font.size.get', null);
    this.bus.publish('themes.get', null);
    this.bus.publish('theme.get', null);
    this.bus.publish('tome.get', null);
  }

  setPanes() {
    this.panes = Math.min(Math.floor(window.innerWidth / 320), 4);
    this.bus.publish('panes.change', this.panes);
  }

  sidebarClick(sidebar) {
    this.bus.publish('sidebar.change', sidebar);
  }

  sidebarUpdate(sidebar) {
    if (sidebar === 'none') {
      this.lastSidebar = this.sidebar;
      this.bus.publish(`pane.${this.sidebar}.hide`, null);
      this.sidebar = sidebar;
      this.bus.publish('pane.read.show', null);
      return;
    }
    if (this.panes === 1) {
      this.bus.publish('pane.read.hide', null);
      this.sidebar = sidebar;
      this.bus.publish(`pane.${this.sidebar}.show`, null);
      return;
    }
    this.bus.publish('pane.read.show', null);
    this.bus.publish(`pane.${this.sidebar}.hide`, null);
    this.sidebar = sidebar;
    this.bus.publish(`pane.${this.sidebar}.show`, null);
    this.bus.publish(`${this.sidebar}.scroll`, null);
  }

  subscribe() {
    this.bus.subscribe('chapter.update',
      (chapter) => { this.chapterUpdate(chapter); }
    );
    this.bus.subscribe('columns.update',
      (columns) => { this.columnsUpdate(columns); }
    );
    this.bus.subscribe('sidebar.update',
      (sidebar) => { this.sidebarUpdate(sidebar); }
    );
    this.bus.subscribe('sidebar.click',
      (sidebar) => { this.sidebarClick(sidebar); }
    );
    this.bus.subscribe('window.resize',
      () => { this.updatePanes(); }
    );
  }

  updatePanes() {
    this.setPanes();
    if (this.currentPanes === this.panes) {
      return;
    }
    if (this.currentPanes > this.panes) {
      this.decreasePanes();
    } else {
      this.increasePanes();
    }
    this.currentPanes = this.panes;
  }

}

export { AppController };
