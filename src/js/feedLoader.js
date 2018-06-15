import axios from 'axios';

export default {
  getDoc: (url) => {
    const proxyURL = 'https://cors-anywhere.herokuapp.com/';
    // const proxyURL = 'https://crossorigin.me/';
    return axios.get(`${proxyURL}${url}`)
      .then(({ data }) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'application/xml');
        return doc;
      });
  },
};
