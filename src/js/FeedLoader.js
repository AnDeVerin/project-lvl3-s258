import axios from 'axios';

const FeedLoader = {
  getDoc: (url) => {
    const proxyURL = 'https://cors-anywhere.herokuapp.com/';

    return new Promise((resolve, reject) => {
      axios.get(`${proxyURL}${url}`)
        .then(({ data }) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, 'application/xml');
          resolve(doc);
        })
        .catch(err => reject(err));
    });
  },
};

export default FeedLoader;
