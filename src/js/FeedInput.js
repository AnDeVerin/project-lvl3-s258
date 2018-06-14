import isURL from 'validator/lib/isURL';

export default class FeedInput {
  constructor(element, getFeedList) {
    this.element = element;
    this.field = element.querySelector('#feedInput');
    this.button = element.querySelector('button');
    this.value = '';
    this.isValidValue = false;
    this.getFeedList = getFeedList;
    this.init();
  }

  init() {
    this.field.addEventListener('input', ({ target }) => {
      this.value = target.value;
      if (this.value) {
        this.isValidValue = isURL(this.value) && this.isNotInList(this.value);
        this.setFormState(this.isValidValue);
      } else {
        this.clearFormState();
      }
    });
  }

  isNotInList(url) {
    return !this.getFeedList().includes(url);
  }

  setFormState(isValid) {
    this.button.disabled = !isValid;
    if (isValid) {
      this.field.classList.add('is-valid');
      this.field.classList.remove('is-invalid');
    } else {
      this.field.classList.add('is-invalid');
      this.field.classList.remove('is-valid');
    }
  }

  clearFormState() {
    this.field.classList.remove('is-valid');
    this.field.classList.remove('is-invalid');
    this.button.disabled = true;
    this.element.reset();
  }

  getValue() { return this.value; }
}
