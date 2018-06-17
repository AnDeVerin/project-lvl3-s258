import RssModel from './RssModel';
import RssView from './RssView';
import RssController from './RssController';

export default () => {
  const rssModel = new RssModel();
  const rssView = new RssView(rssModel);
  const rssController = new RssController(rssModel, rssView);

  const updateFeeds = () => {
    const feeds = rssModel.getFeedUrlList();
    if (feeds.length === 0) {
      setTimeout(updateFeeds, 5000);
    } else {
      const updateAllFeeds = rssModel.updateAllFeeds();
      Promise.all(updateAllFeeds)
        .then(() => setTimeout(updateFeeds, 5000));
    }
  };

  rssController.init();
  updateFeeds();
};
// http://feeds.bbci.co.uk/news/rss.xml
// https://www.eurekalert.org/rss/technology_engineering.xml
// http://lorem-rss.herokuapp.com/feed
// http://lorem-rss.herokuapp.com/feed?unit=second&interval=4

// Use that article as an example:
// https://www.awwwards.com/build-a-simple-javascript-app-the-mvc-way.html
