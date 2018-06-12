import Example from './Example';

export default () => {
  const element = document.getElementById('point');
  if (element) {
    const obj = new Example(element);
    obj.init();
  }
};
