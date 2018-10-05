'use strict';

class EventBus {

  constructor() {
    this.topics = {};
  }

  subscribe(topic, listener) {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }
    this.topics[topic].push(listener);
  }

  publish(topic, data) {
    if (!this.topics[topic] || this.topics[topic].length < 1) {
      return;
    }
    this.topics[topic].forEach(
      (listener) => {
        listener(data);
      }
    );
  }
}

export {
  EventBus
};
