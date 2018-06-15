export default {

  feedList: (element, state) => {
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
    element.innerHTML = listHtml.join(''); // eslint-disable-line
  },

  articleList: (element, state) => {
    const listHtml = [];
    state.feedList.forEach((channel) => {
      const items = [...channel.getElementsByTagName('item')];
      const articlesInChannelHtml = items.map((item) => {
        const [title] = [...item.getElementsByTagName('title')];
        const [link] = [...item.getElementsByTagName('link')];
        const [description] = [...item.getElementsByTagName('description')];
        return `
          <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <a href="${link.textContent}" target="_blank">${title.textContent}</a>
            <a href="#" 
              class="badge badge-light"
              data-toggle="modal" 
              data-target="#descModal"
              data-description="${description.textContent}">Description</a>
          </li>`;
      });
      listHtml.push(articlesInChannelHtml.join(''));
    });
    element.innerHTML = listHtml.join(''); // eslint-disable-line
  },


  formState: (form, state) => {
    const status = form.querySelector('#inputStatus');
    const button = form.submitButton;
    const field = form.feedInput;
    // console.log(state);
    switch (state) {
      case 'clean':
        field.classList.remove('is-valid');
        field.classList.remove('is-invalid');
        field.disabled = false;
        status.textContent = 'Input URL-address';
        status.classList.remove('text-danger');
        status.classList.remove('text-success');
        status.classList.add('text-muted');
        button.disabled = true;
        form.reset();
        break;
      case 'valid':
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        status.textContent = 'Looks good!';
        status.classList.remove('text-muted');
        status.classList.remove('text-danger');
        status.classList.add('text-success');
        button.disabled = false;
        break;
      case 'non-valid':
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        status.textContent = 'Invalid URL-address';
        status.classList.remove('text-muted');
        status.classList.remove('text-success');
        status.classList.add('text-danger');
        button.disabled = true;
        break;
      case 'wait':
        field.disabled = true;
        status.textContent = 'Loading new RSS feed...';
        status.classList.remove('text-danger');
        status.classList.remove('text-success');
        status.classList.add('text-muted');
        button.disabled = true;
        break;
      case 'error':
        field.classList.add('is-invalid');
        field.disabled = false;
        status.textContent = 'Can\'t load this URL. Bad address or no RSS-channel there.';
        status.classList.remove('text-muted');
        status.classList.add('text-danger');
        button.disabled = false;
        break;
      default:
    }
  },
};
