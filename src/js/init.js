import FeedInput from './FeedInput';
import FeedLoader from './FeedLoader';
import State from './State';
import Renderer from './Renderer';


export default () => {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  const state = new State();
  const renderer = new Renderer(appRoot);

  const inputFormElem = appRoot.querySelector('#inputForm');
  const inputForm = new FeedInput(inputFormElem, state.getFeedList.bind(state));

  const addNewFeed = (url) => {
    FeedLoader.getDoc(url)
      .then((doc) => {
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


  // addNewFeed('http://lorem-rss.herokuapp.com/feed');
  // addNewFeed('http://lorem-rss.herokuapp.com/feed?unit=second&interval=30');
  // addNewFeed('http://lorem-rss.herokuapp.com/feed?unit=second');
};
