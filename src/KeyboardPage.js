export default class KeyboardPage {
  constructor() {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    const content = document.createElement('div');
    content.className = 'content';
    wrapper.appendChild(content);

    const about = document.createElement('div');
    about.classList = 'description';
    about.innerHTML = 'Переключение раскладки клавиатуры ctrl+shift, клавиатура создавалась в Windows';
    wrapper.appendChild(about);

    const form = document.createElement('form');
    form.action = '#';
    form.className = 'form';
    content.appendChild(form);

    const label = document.createElement('label');
    label.htmlFor = 'area';
    label.innerHTML = 'Type text here:';
    form.appendChild(label);

    const area = document.createElement('textarea');
    area.id = 'textarea';
    form.appendChild(area);

    const keyboard = document.createElement('div');
    keyboard.className = 'keyboard';
    keyboard.setAttribute('id', 'keyboard');
    content.append(keyboard);
    area.focus();
    this.wrapper = wrapper;
  }

  render() {
    document.body.append(this.wrapper);
  }
}
