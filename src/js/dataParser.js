// parse rss document

export const getChannel = (doc) => {
  const channel = doc.querySelector('channel');
  const titleEl = channel.querySelector('title');
  const descriptionEl = channel.querySelector('description');
  return {
    title: titleEl.textContent,
    description: descriptionEl.textContent,
  };
};

export const getArticles = (doc) => {
  const channel = doc.querySelector('channel');
  const items = [...channel.querySelectorAll('item')];
  return items.map((item) => {
    const titleEl = item.querySelector('title');
    const linkEl = item.querySelector('link');
    const descriptionEl = item.querySelector('description');
    return {
      title: titleEl.textContent,
      description: descriptionEl.textContent,
      link: linkEl.textContent,
    };
  });
};
