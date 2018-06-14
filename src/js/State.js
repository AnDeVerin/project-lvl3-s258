export default class State {
  constructor() {
    this.feedList = new Map();
  }

  getFeedList() {
    return [...this.feedList.keys()];
  }

  addFeed(url, channel) {
    this.feedList.set(url, channel);
  }
}
