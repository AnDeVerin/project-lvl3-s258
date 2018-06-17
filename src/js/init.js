import $ from 'jquery';
import _ from 'lodash';
import isURL from 'validator/lib/isURL';

import State from './State';
import getDoc from './feedLoader';
import { getChannel, getArticles } from './dataParser';
import { renderFeedList, renderArticleList, renderFormState } from './render';

export default () => {
  const state = new State();
  const appRoot = document.getElementById('app');

  // DOM elements
  const formElem = appRoot.querySelector('#inputForm');
  const inputElem = appRoot.querySelector('#feedInput');
  const feedListElem = appRoot.querySelector('#feedList');
  const articleListElem = appRoot.querySelector('#articleList');

  const addNewFeed = (url) => {
    getDoc(url)
      .then((doc) => {
        const channel = getChannel(doc);
        const articles = getArticles(doc);
        state.addFeed(url, channel, articles);
        renderFeedList(feedListElem, state.getFeedList());
        renderArticleList(articleListElem, state.getArticleList());
        renderFormState(formElem, 'clean');
      })
      .catch((error) => {
        renderFormState(formElem, 'error');
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
        return getDoc(feed)
          .then((doc) => {
            const articlesFromFeed = getArticles(doc);
            const currentArticles = state.getArticleList();
            const newArticles = _.differenceBy(articlesFromFeed, currentArticles, 'link');
            if (newArticles.length > 0) {
              state.addNewArticles(newArticles);
              renderArticleList(articleListElem, state.getArticleList());
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
      renderFormState(formElem, inputState);
    } else {
      renderFormState(formElem, 'clean');
    }
  });

  formElem.addEventListener('submit', (e) => {
    e.preventDefault();
    renderFormState(formElem, 'wait');
    addNewFeed(inputElem.value);
  });

  $('#descModal').on('show.bs.modal', (event) => {
    const button = $(event.relatedTarget);
    const description = button.data('description');
    const modal = $('#descModal');
    modal.find('.modal-body').text(description);
  });

  addNewFeed('http://feeds.bbci.co.uk/news/rss.xml');
  // addNewFeed('https://www.eurekalert.org/rss/technology_engineering.xml');
  // addNewFeed('http://lorem-rss.herokuapp.com/feed');
  // addNewFeed('http://lorem-rss.herokuapp.com/feed?unit=second&interval=4');
};
