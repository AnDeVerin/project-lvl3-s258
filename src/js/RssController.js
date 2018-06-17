export default class RssController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init() {
    this.setupHandlers()
      .enable();
  }

  setupHandlers() {
    this.addFeedHandler = this.addFeed.bind(this);
    this.addArticlesHandler = this.addArticles.bind(this);
    this.changeFormHandler = this.changeForm.bind(this);

    return this;
  }

  enable() {
    this.view.addFeedEvent.attach(this.addFeedHandler);
    this.view.changeFormEvent.attach(this.changeFormHandler);

    this.model.addArticlesEvent.attach(this.addArticlesHandler);

    return this;
  }

  addFeed(sender, args) {
    this.model.addFeed(args.feedUrl);
  }

  changeForm(sender, args) {
    this.model.changeForm(args.inputUrl);
  }

  addArticles() {
    this.view.addArticles();
  }
}
