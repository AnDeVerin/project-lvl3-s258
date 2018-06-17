import _ from 'lodash';
import isURL from 'validator/lib/isURL';
import Event from './EventDispatcher';
import getDoc from './feedLoader';
import { getChannel, getArticles } from './dataParser';

export default class RssModel {
  constructor() {
    this.formState = 'clean';
    this.feedList = new Map();
    this.articleList = new Map();
    this.addFeedEvent = new Event(this);
    this.addArticlesEvent = new Event(this);
    this.changeFormEvent = new Event(this);
  }

  addFeed(url) {
    this.formState = 'wait';
    this.changeFormEvent.notify();
    getDoc(url)
      .then((doc) => {
        const channel = getChannel(doc);
        const articles = getArticles(doc);
        this.feedList.set(url, channel);
        this.formState = 'clean';
        this.changeFormEvent.notify();
        this.addFeedEvent.notify();
        this.addArticles(articles);
      })
      .catch((error) => {
        this.formState = 'error';
        this.changeFormEvent.notify();
        console.log(error);
      });
  }

  addArticles(articles) {
    articles.forEach(({ link, title, description }) =>
      this.articleList.set(link, { link, title, description }));

    this.addArticlesEvent.notify();
  }

  changeForm(inputValue) {
    if (inputValue) {
      const isInputValid = isURL(inputValue) && this.isNotInList(inputValue);
      this.formState = isInputValid ? 'valid' : 'non-valid';
      this.changeFormEvent.notify();
    } else {
      this.formState = 'clean';
      this.changeFormEvent.notify();
    }
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

  getFormState() {
    return this.formState;
  }

  updateAllFeeds() {
    const feeds = this.getFeedUrlList();
    return feeds.map((feed) => {
      console.log(`Loading ${feed}...`);
      return getDoc(feed)
        .then((doc) => {
          const articlesFromFeed = getArticles(doc);
          const currentArticles = this.getArticleList();
          const newArticles = _.differenceBy(articlesFromFeed, currentArticles, 'link');
          if (newArticles.length > 0) {
            this.addArticles(newArticles);
          }
          console.log(`${newArticles.length} articles added from ${feed}.`);
        })
        .catch(error => console.log(error))
        .finally();
    });
  }
}
