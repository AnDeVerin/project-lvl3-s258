export default class State {
  constructor() {
    this.feedList = new Map();
  }

  addFeed(url, channel) {
    this.feedList.set(url, channel);
  }

  getFeedList() {
    return [...this.feedList.keys()];
  }

  isNotInList(url) {
    return !this.getFeedList().includes(url);
  }
}
