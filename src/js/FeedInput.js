import isURL from 'validator/lib/isURL';

export default class FeedInput {
  constructor(element, getFeedList) {
    this.element = element;
    this.field = element.querySelector('#feedInput');
    this.button = element.querySelector('button');
    this.status = element.querySelector('#inputStatus');
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
      this.field.classList.remove('is-invalid');
      this.field.classList.add('is-valid');
      this.status.textContent = 'Looks good!';
      this.status.classList.remove('text-muted');
      this.status.classList.remove('text-danger');
      this.status.classList.add('text-success');
    } else {
      this.field.classList.remove('is-valid');
      this.field.classList.add('is-invalid');
      this.status.textContent = 'Invalid URL-address';
      this.status.classList.remove('text-muted');
      this.status.classList.remove('text-success');
      this.status.classList.add('text-danger');
    }
  }

  setWaitMode() {
    this.button.disabled = true;
    this.field.disabled = true;
    this.status.textContent = 'Loading new URL-address...';
    this.status.classList.remove('text-danger');
    this.status.classList.remove('text-success');
    this.status.classList.add('text-muted');
  }

  setUrlError() {
    this.field.disabled = false;
    this.field.classList.add('is-invalid');
    this.status.textContent = 'Can\'t load this URL. Bad address or no RSS-channel there.';
    this.status.classList.remove('text-muted');
    this.status.classList.add('text-danger');
  }

  clearFormState() {
    this.field.classList.remove('is-valid');
    this.field.classList.remove('is-invalid');
    this.status.textContent = 'Input valid URL-address';
    this.status.classList.remove('text-danger');
    this.status.classList.remove('text-success');
    this.status.classList.add('text-muted');
    this.button.disabled = true;
    this.field.disabled = false;
    this.element.reset();
  }

  getValue() { return this.value; }
}
