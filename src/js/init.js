import $ from 'jquery';
import FeedInput from './FeedInput';
import FeedLoader from './FeedLoader';
import State from './State';
import Renderer from './Renderer';


export default () => {
  $('#myModal').modal();

  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  const state = new State();
  const renderer = new Renderer(appRoot);

  const inputFormElem = appRoot.querySelector('#inputForm');
  const inputForm = new FeedInput(inputFormElem, state.getFeedList.bind(state));

  const addNewFeed = (url) => {
    FeedLoader.getDoc(url)
      .then((doc) => {
        // console.log(doc);
        const channel = doc.getElementsByTagName('channel')[0];
        state.addFeed(url, channel);
        renderer.renderFeedList(state);
        renderer.renderArticleList(state);
        inputForm.clearFormState();
      })
      .catch((error) => {
        inputForm.setUrlError();
        console.log(error);
      });
  };

  inputFormElem.addEventListener('submit', (e) => {
    e.preventDefault();
    const newFeedUrl = inputForm.getValue();
    inputForm.setWaitMode();
    console.log(newFeedUrl);
    addNewFeed(newFeedUrl);
  });

  // bootstrap modal handler
  $('#descModal').on('show.bs.modal', function (event) {  // eslint-disable-line
    const button = $(event.relatedTarget);
    const description = button.data('description');
    const modal = $(this);
    modal.find('.modal-body').text(description);
  });

  addNewFeed('http://feeds.bbci.co.uk/news/rss.xml');
  // addNewFeed('https://www.eurekalert.org/rss/technology_engineering.xml');
  // addNewFeed('http://lorem-rss.herokuapp.com/feed');
  // addNewFeed('http://lorem-rss.herokuapp.com/feed?unit=second&interval=30');
};
