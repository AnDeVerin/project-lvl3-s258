import $ from 'jquery';
import isURL from 'validator/lib/isURL';
// import FeedInput from './FeedInput';
import feedLoader from './feedLoader';
import State from './State';
import render from './render';

export default () => {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  const state = new State();

  // DOM elements
  const formElem = appRoot.querySelector('#inputForm');
  const inputElem = appRoot.querySelector('#feedInput');
  const feedListElem = appRoot.querySelector('#feedList');
  const articleListElem = appRoot.querySelector('#articleList');

  const addNewFeed = (url) => {
    console.log(url);
    feedLoader.getDoc(url)
      .then((doc) => {
        const channel = doc.getElementsByTagName('channel')[0];
        state.addFeed(url, channel);
        render.feedList(feedListElem, state);
        render.articleList(articleListElem, state);
        render.formState(formElem, 'clean');
      })
      .catch((error) => {
        render.formState(formElem, 'error');
        console.log(error);
      });
  };

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
  // addNewFeed('http://lorem-rss.herokuapp.com/feed?unit=second&interval=30');
};
