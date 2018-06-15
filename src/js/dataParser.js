// parse rss document

export default {
  getChannel: (doc) => {
    const channel = doc.getElementsByTagName('channel')[0];
    const [titleEl] = channel.getElementsByTagName('title');
    const [descriptionEl] = channel.getElementsByTagName('description');
    return {
      title: titleEl.textContent,
      description: descriptionEl.textContent,
    };
  },

  getArticles: (doc) => {
    const channel = doc.getElementsByTagName('channel')[0];
    const items = [...channel.getElementsByTagName('item')];
    return items.map((item) => {
      const [titleEl] = [...item.getElementsByTagName('title')];
      const [linkEl] = [...item.getElementsByTagName('link')];
      const [descriptionEl] = [...item.getElementsByTagName('description')];
      return {
        title: titleEl.textContent,
        description: descriptionEl.textContent,
        link: linkEl.textContent,
      };
    });
  },
};
