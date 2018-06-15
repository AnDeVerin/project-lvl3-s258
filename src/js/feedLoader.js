import axios from 'axios';

export default {
  getDoc: (url) => {
    const proxyURL = 'https://cors-anywhere.herokuapp.com/';
    return axios.get(`${proxyURL}${url}`)
      .then(({ data }) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'application/xml');
        return doc;
      });
  },
};
