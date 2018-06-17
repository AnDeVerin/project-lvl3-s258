import $ from 'jquery';
import Event from './EventDispatcher';

export default class RssView {
  constructor(model) {
    this.model = model;
    this.addFeedEvent = new Event(this);
    this.addArticlesEvent = new Event(this);
    this.changeFormEvent = new Event(this);

    this.init();
  }

  init() {
    this.createChildren()
      .setupHandlers()
      .enable();
  }

  createChildren() {
    // cache the document object
    this.$container = $('#app');
    this.$modal = $('#descModal');
    this.$form = this.$container.find('#inputForm');
    this.$input = this.$container.find('#feedInput');
    this.$feedList = this.$container.find('#feedList');
    this.$articleList = this.$container.find('#articleList');

    return this;
  }

  setupHandlers() {
    this.addFeedButtonHandler = this.addFeedButton.bind(this);
    this.changeFormInputHadler = this.changeFormInput.bind(this);

    // Handlers from Event Dispatcher
    this.addFeedHandler = this.addFeed.bind(this);
    this.clearInputFieldHandler = this.clearInputField.bind(this);
    this.changeFormHadler = this.changeForm.bind(this);

    return this;
  }

  enable() {
    this.$form.on('submit', (e) => {
      e.preventDefault();
      this.addFeedButtonHandler();
    });

    this.$input.on('input', this.changeFormInputHadler);

    this.$modal.on('show.bs.modal', (event) => {
      const button = $(event.relatedTarget);
      const description = button.data('description');
      this.$modal.find('.modal-body').text(description);
    });

    // Event Dispatcher
    this.model.addFeedEvent.attach(this.addFeedHandler);
    this.model.addFeedEvent.attach(this.clearInputFieldHandler);
    this.model.changeFormEvent.attach(this.changeFormHadler);

    return this;
  }

  addFeedButton() {
    this.addFeedEvent.notify({ feedUrl: this.$input.val() });
  }

  changeFormInput() {
    this.changeFormEvent.notify({ inputUrl: this.$input.val() });
  }

  buildFeedList() {
    const list = this.model.getFeedList();
    const listHtml = list.map(({ title, description }) =>
      `<li class="list-group-item">
        <h6 class="mb-1">${title}</h6>
        <p class="small mb-1">${description}</p>
      </li>`);
    this.$feedList.html(listHtml.join(''));
  }

  buildArticlesList() {
    const list = this.model.getArticleList();
    const listHtml = list.map(({ link, title, description }) =>
      `<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
        <a href="${link}" target="_blank">${title}</a>
          <a href="#" 
            class="badge badge-light"
            data-toggle="modal" 
            data-target="#descModal"
            data-description="${description}">Description</a>
      </li>`);
    this.$articleList.html(listHtml.join(''));
  }

  // ----- Handlers From Event Dispatcher -----
  clearInputField() {
    this.$input.val('');
  }

  addFeed() {
    this.buildFeedList();
  }

  addArticles() {
    this.buildArticlesList();
  }

  changeForm() {
    const state = this.model.getFormState();
    this.updateFormState(state);
  }

  updateFormState(state) {
    const status = this.$form.find('#inputStatus');
    const button = this.$form.find('#submitButton');
    const field = this.$input;
    // console.log(state);
    switch (state) {
      case 'clean':
        field.removeClass('is-valid');
        field.removeClass('is-invalid');
        field.prop('disabled', false);
        status.text('Input URL-address');
        status.removeClass('text-danger');
        status.removeClass('text-success');
        status.addClass('text-muted');
        button.prop('disabled', true);
        this.$form.val('');
        break;
      case 'valid':
        field.removeClass('is-invalid');
        field.addClass('is-valid');
        status.text('Looks good!');
        status.removeClass('text-muted');
        status.removeClass('text-danger');
        status.addClass('text-success');
        button.prop('disabled', false);
        break;
      case 'non-valid':
        field.removeClass('is-valid');
        field.addClass('is-invalid');
        status.text('Invalid URL-address');
        status.removeClass('text-muted');
        status.removeClass('text-success');
        status.addClass('text-danger');
        button.prop('disabled', true);
        break;
      case 'wait':
        field.prop('disabled', true);
        status.text('Loading new RSS feed...');
        status.removeClass('text-danger');
        status.removeClass('text-success');
        status.addClass('text-muted');
        button.prop('disabled', true);
        break;
      case 'error':
        field.addClass('is-invalid');
        field.prop('disabled', false);
        status.text('Can\'t load this URL. Bad address or no RSS-channel there.');
        status.removeClass('text-muted');
        status.addClass('text-danger');
        button.prop('disabled', false);
        break;
      default:
    }
  }
}
