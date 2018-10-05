'use strict';

class ReadModel {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  columnsChange(columns) {
    this.columns = columns;
    this.columnsSave();
    this.bus.publish('columns.update', this.columns);
  }

  columnsGet() {
    let value = localStorage.getItem('columns');
    if (!value) {
      this.columns = 1;
      this.columnsSave();
    } else {
      this.columns = JSON.parse(value);
    }
    this.bus.publish('columns.update', this.columns);
  }

  columnsSave() {
    localStorage.setItem('columns', JSON.stringify(this.columns));
  }

  initialize() {
    this.subscribe();
  }

  subscribe() {
    this.bus.subscribe('columns.change',
      (columns) => { this.columnsChange(columns); }
    );
    this.bus.subscribe('columns.get',
      () => { this.columnsGet(); }
    );
  }

}

export {
  ReadModel
};
