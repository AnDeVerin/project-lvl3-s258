export default class State {
  constructor() {
    this.feedList = new Map();
    this.articleList = new Map();
  }

  addFeed(url, channel, articles) {
    this.feedList.set(url, channel);
    this.addNewArticles(articles);
  }

  addNewArticles(articles) {
    articles.forEach(({ link, title, description }) =>
      this.articleList.set(link, { link, title, description }));
  }

  getFeedList() {
    return [...this.feedList.values()];
  }

  getArticleList() {
    return [...this.articleList.values()];
  }

  getFeedUrlList() {
    return [...this.feedList.keys()];
  }

  isNotInList(url) {
    return !this.getFeedUrlList().includes(url);
  }
}
