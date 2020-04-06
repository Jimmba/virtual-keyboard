import keyboardLayout from './data';

export default class Keyboard {
  constructor() {
    this.text = '';
    this.buttonsArray = [];
    this.toChangeKeyboard = false;
    this.specialKeys = {
      ShiftLeft: false,
      ShiftRight: false,
      CapsLock: false,
      ControlLeft: false,
      AltLeft: false,
      ControlRight: false,
      AltRight: false,
      MetaLeft: false,
    };
    this.getKeys(this.getLang());
    this.textarea = document.querySelector('textarea');
  }

  getLang() {
    if (localStorage.getItem('lang') === null) {
      localStorage.setItem('lang', 'en');
    }
    this.lang = localStorage.getItem('lang');
    return localStorage.getItem('lang');
  }

  changeLang() {
    if (localStorage.getItem('lang') === 'ru') {
      localStorage.setItem('lang', 'en');
    } else {
      localStorage.setItem('lang', 'ru');
    }
    this.getKeys(this.getLang());
  }

  getKeys(lang) {
    if (lang === 'ru') {
      this.buttonsArray = keyboardLayout.ru;
    } else {
      this.buttonsArray = keyboardLayout.en;
    }
  }

  getArrowButton(options) {
    this.button = document.createElement('div');
    const [name, type, text] = options;
    this.button.className = `keyboard_btn keyboard_btn_${name} ${type}`;
    this.button.setAttribute('id', name);
    this.button.innerHTML = text;
    return this.button;
  }

  switchKeyboard() {
    const keyboard = document.getElementsByClassName('keyboard')[0];

    let kbrdbtn; let first; let
      second;
    for (let i = 0; i < this.buttonsArray.length; i += 1) {
      kbrdbtn = document.createElement('div');

      kbrdbtn.className = `keyboard_btn keyboard_btn_${this.buttonsArray[i][0]} ${this.buttonsArray[i][1]} en`;
      kbrdbtn.setAttribute('id', this.buttonsArray[i][0]);
      const [key, type, value] = this.buttonsArray[i];
      if (type === 'special' && key !== undefined) {
        kbrdbtn.innerHTML = value;
      } else {
        const [smallSymbol, bigSymbol] = value;
        first = document.createElement('div');
        first.className = 'keyboard_btn_shift';
        first.innerHTML = bigSymbol;
        kbrdbtn.appendChild(first);

        second = document.createElement('div');
        second.className = 'keyboard_btn_simple';
        second.innerHTML = smallSymbol;
        kbrdbtn.appendChild(second);
      }
      keyboard.append(kbrdbtn);
    }

    // navigation
    const nav = [['ArrowLeft', 'special', 'left'],
      ['ArrowUp', 'special', 'up'],
      ['ArrowDown', 'special', 'down'],
      ['ArrowRight', 'special', 'right']];

    const [left, up, down, right] = nav;

    // const btnLeft = document.createElement('div');
    // let [button, type, text] = left;
    // btnLeft.className = `keyboard_btn keyboard_btn_${button} ${type}`;
    // btnLeft.setAttribute('id', button);
    // btnLeft.innerHTML = text;
    const btnLeft = this.getArrowButton(left);
    keyboard.append(btnLeft);

    const btnUp = this.getArrowButton(up);
    const btnDown = this.getArrowButton(down);

    const double = document.createElement('div');
    double.className = 'keyboard_btn_up_down';
    double.appendChild(btnUp);
    double.appendChild(btnDown);
    keyboard.append(double);

    const btnRight = this.getArrowButton(right);
    keyboard.append(btnRight);
  }

  changeKeyboard() {
    this.changeLang();
    document.getElementById('keyboard').classList.add('keyboard_hide');
    setTimeout(() => {
      document.getElementById('keyboard').classList.remove('keyboard_hide');
      const buttons = document.getElementById('keyboard').childNodes;
      for (let i = buttons.length - 1; i > 0; i -= 1) {
        buttons[i].remove();
      }
      this.switchKeyboard();
    }, 500);
  }

  print(key) {
    this.textarea.focus();
    if (key !== 'ShiftLeft' && key !== 'ShiftRight' && key !== 'CapsLock' && key !== 'ControlLeft' && key !== 'AltLeft' && key !== 'ControlRight' && key !== 'AltRight' && key !== 'MetaLeft') {
      let k = 0;
      if (key === 'Tab') {
        this.addSybmol('\t');
      } else if (key === 'Enter') {
        this.addSybmol('\n');
      } else if (key === 'Backspace' || key === 'Delete') {
        this.removeSymbol(key);
      } else if (key === 'ArrowRight' || key === 'ArrowLeft' || key === 'ArrowUp' || key === 'ArrowDown') {
        this.moveCursor(key);
      } else {
        if (this.specialKeys.CapsLock) {
          if (!this.specialKeys.ShiftLeft && !this.specialKeys.ShiftRight) {
            k = 1;
          }
        } else if (this.specialKeys.ShiftLeft || this.specialKeys.ShiftRight) {
          k = 1;
        }
        const symbol = this.getSymbol(key, k);
        if (symbol) this.addSybmol(symbol);
      }
    }
  }

  moveCursor(button) {
    let move; let firstEndOfString; let secondEndOfString;
    let previousEndOfString;
    let positionInRow;
    const position = this.textarea.selectionStart;
    switch (button) {
      case 'ArrowRight':
        move = 1;
        break;
      case 'ArrowLeft':
        move = -1;
        break;
      case 'ArrowUp':
        firstEndOfString = this.text.substring(0, position).lastIndexOf('\n');
        if (firstEndOfString === -1) {
          move = 0;
        } else {
          secondEndOfString = this.text.substring(0, firstEndOfString).lastIndexOf('\n');
        }

        if (position - firstEndOfString > 72) {
          move = 72;
        } else if (firstEndOfString - secondEndOfString > 72) {
          move = 73;
        } else if (position - firstEndOfString > firstEndOfString - secondEndOfString) {
          move = position - firstEndOfString;
        } else {
          move = position - (secondEndOfString + (position - firstEndOfString));
        }
        move = -move;
        break;
      case 'ArrowDown':
        previousEndOfString = this.text.substring(0, position).lastIndexOf('\n');
        positionInRow = (position - previousEndOfString) % 72;
        firstEndOfString = this.text.indexOf('\n', position);
        if (firstEndOfString === -1) {
          if (this.text.length - position < 72) {
            move = 0;
          } else {
            move = 72;
          }
        } else if (firstEndOfString - position > 72) {
          move = 72;
        } else {
          secondEndOfString = this.text.indexOf('\n', firstEndOfString + 1);
          if (secondEndOfString === -1) secondEndOfString = this.text.length;
          if (secondEndOfString - firstEndOfString < positionInRow) {
            move = secondEndOfString - position;
          } else {
            move = firstEndOfString + positionInRow - position;
          }
        }
        break;
      default:
        break;
    }

    const start = document.getElementById('textarea').selectionStart;
    if (start + move < 0) {
      document.getElementById('textarea').selectionEnd = 0;
      document.getElementById('textarea').selectionStart = 0;
    } else {
      document.getElementById('textarea').selectionEnd = start + move;
      document.getElementById('textarea').selectionStart = start + move;
    }
    this.textarea.focus();
  }

  addSybmol(symbol) {
    const start = document.getElementById('textarea').selectionStart;
    const end = document.getElementById('textarea').selectionEnd;
    this.text = this.text.substring(0, start) + symbol + this.text.substring(end, this.text.length);
    this.textarea.innerHTML = this.text;
    document.getElementById('textarea').selectionEnd = start + 1;
    document.getElementById('textarea').selectionStart = start + 1;
  }

  removeSymbol(key) {
    const start = document.getElementById('textarea').selectionStart;
    const end = document.getElementById('textarea').selectionEnd;
    let { text } = this;
    let shift;
    if (start === end) {
      shift = 1;
    } else {
      shift = 0;
    }
    if (key === 'Delete') {
      text = text.substring(0, start) + text.substring(end + shift, text.length);
      this.textarea.innerHTML = text;
      document.getElementById('textarea').selectionEnd = start;
      document.getElementById('textarea').selectionStart = start;
    } else {
      text = text.substring(0, start - shift) + text.substring(end, text.length);
      this.textarea.innerHTML = text;
      document.getElementById('textarea').selectionEnd = start - shift;
      document.getElementById('textarea').selectionStart = start - shift;
    }
  }

  getSymbol(key, k) {
    let position = k;
    if (key === 'Space') {
      position = 0;
    }

    for (let i = 0; i < this.buttonsArray.length; i += 1) {
      if (this.buttonsArray[i][0] === key) {
        return this.buttonsArray[i][2][position];
      }
    }

    return null;
  }
}
