import $ from 'jquery';
import _ from 'lodash';
import isURL from 'validator/lib/isURL';
import feedLoader from './feedLoader';
import State from './State';
import render from './render';
import dataParser from './dataParser';

export default () => {
  const state = new State();
  const appRoot = document.getElementById('app');

  // DOM elements
  const formElem = appRoot.querySelector('#inputForm');
  const inputElem = appRoot.querySelector('#feedInput');
  const feedListElem = appRoot.querySelector('#feedList');
  const articleListElem = appRoot.querySelector('#articleList');

  const addNewFeed = (url) => {
    feedLoader.getDoc(url)
      .then((doc) => {
        const channel = dataParser.getChannel(doc);
        const articles = dataParser.getArticles(doc);
        state.addFeed(url, channel, articles);
        render.feedList(feedListElem, state.getFeedList());
        render.articleList(articleListElem, state.getArticleList());
        render.formState(formElem, 'clean');
      })
      .catch((error) => {
        render.formState(formElem, 'error');
        console.log(error);
      });
  };

  const updateFeeds = () => {
    const feeds = state.getFeedUrlList();
    if (feeds.length === 0) {
      setTimeout(updateFeeds, 5000);
    } else {
      const updateAllFeeds = feeds.map((feed) => {
        console.log(`Loading ${feed}...`);
        return feedLoader.getDoc(feed)
          .then((doc) => {
            const articlesFromFeed = dataParser.getArticles(doc);
            const currentArticles = state.getArticleList();
            const newArticles = _.differenceBy(articlesFromFeed, currentArticles, 'link');
            if (newArticles.length > 0) {
              state.addNewArticles(newArticles);
              render.articleList(articleListElem, state.getArticleList());
            }
            console.log(`${newArticles.length} articles added from ${feed}.`);
          })
          .catch(error => console.log(error))
          .finally();
      });
      Promise.all(updateAllFeeds).then(() => setTimeout(updateFeeds, 5000));
    }
  };

  // start auto-update
  updateFeeds();

  // handlers
  inputElem.addEventListener('input', ({ target }) => {
    if (target.value) {
      const isInputValid = isURL(target.value) && state.isNotInList(target.value);
      const inputState = isInputValid ? 'valid' : 'non-valid';
      render.formState(formElem, inputState);
    } else {
      render.formState(formElem, 'clean');
    }
  });

  formElem.addEventListener('submit', (e) => {
    e.preventDefault();
    render.formState(formElem, 'wait');
    addNewFeed(inputElem.value);
  });

  $('#descModal').on('show.bs.modal', (event) => {
    const button = $(event.relatedTarget);
    const description = button.data('description');
    const modal = $('#descModal');
    modal.find('.modal-body').text(description);
  });

  // addNewFeed('http://feeds.bbci.co.uk/news/rss.xml');
  // addNewFeed('https://www.eurekalert.org/rss/technology_engineering.xml');
  // addNewFeed('http://lorem-rss.herokuapp.com/feed');
  // addNewFeed('http://lorem-rss.herokuapp.com/feed?unit=second&interval=4');
};
