export default class Renderer {
  constructor(root) {
    this.feedListElement = root.querySelector('#feedList');
    this.articleListElement = root.querySelector('#articleList');
  }

  renderFeedList(state) {
    const listHtml = [];
    state.feedList.forEach((channel) => {
      const [title] = channel.getElementsByTagName('title');
      const [description] = channel.getElementsByTagName('description');
      const itemHtml = `
        <li class="list-group-item">
          <h6 class="mb-1">${title.textContent}</h6>
          <p class="small mb-1">${description.textContent}</p>
        </li>`;
      listHtml.push(itemHtml);
    });
    this.feedListElement.innerHTML = listHtml.join('');
  }

  renderArticleList(state) {
    const listHtml = [];
    state.feedList.forEach((channel) => {
      const items = [...channel.getElementsByTagName('item')];
      const articlesInChannelHtml = items.map((item) => {
        const [title] = [...item.getElementsByTagName('title')];
        const [link] = [...item.getElementsByTagName('link')];
        return `<a href="${link.textContent}" 
          class="list-group-item list-group-item-action" 
          target="_blank">${title.textContent}</a>`;
      });
      listHtml.push(articlesInChannelHtml.join(''));
    });
    this.articleListElement.innerHTML = listHtml.join('');
  }
}
