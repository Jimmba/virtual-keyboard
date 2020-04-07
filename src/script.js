import KeyboardPage from './KeyboardPage';
import Keyboard from './Keyboard';

const keyboardPage = new KeyboardPage();
keyboardPage.render();
const keyboard = new Keyboard();
keyboard.switchKeyboard();

function specialKeysStateOn(key) {
  if (key === 'ShiftLeft' || key === 'ShiftRight' || key === 'ControlLeft' || key === 'AltLeft' || key === 'ControlRight' || key === 'AltRight' || key === 'MetaLeft') {
    keyboard.specialKeys[key] = true;
  }
}

function specialKeysStateOff(key) {
  if (key === 'ShiftLeft' || key === 'ShiftRight' || key === 'ControlLeft' || key === 'AltLeft' || key === 'ControlRight' || key === 'AltRight' || key === 'MetaLeft') {
    keyboard.specialKeys[key] = false;
  }
}

function addActiveButton(key) {
  if (document.getElementsByClassName(`keyboard_btn_${key}`)[0]) {
    document.getElementsByClassName(`keyboard_btn_${key}`)[0].classList.add('active_btn');
  }
}

function removeActiveButton(key) {
  if (document.getElementsByClassName(`keyboard_btn_${key}`)[0]) {
    document.getElementsByClassName(`keyboard_btn_${key}`)[0].classList.remove('active_btn');
  }
}

function capsLockToggle(key) {
  if (keyboard.specialKeys[key] === false) {
    keyboard.specialKeys[key] = true;
    addActiveButton(key);
  } else {
    keyboard.specialKeys[key] = false;
    removeActiveButton(key);
  }
}

function checkOfNeedChangeKeyboard(key) {
  if (key === 'ShiftLeft' || key === 'ShiftRight') {
    if (keyboard.specialKeys.AltLeft === true || keyboard.specialKeys.AltRight === true) {
      keyboard.toChangeKeyboard = true;
    }
  }
}

function keyDownEvent(e) {
  const key = e.code;
  specialKeysStateOn(key);// if pressed special keys - write true in obj.
  if (key !== 'CapsLock') {
    specialKeysStateOn(key);
    addActiveButton(key);
    keyboard.print(key);
    e.preventDefault();
  } else {
    capsLockToggle(key);
  }
  checkOfNeedChangeKeyboard(key);
}

function specialKeysStateSwitch(key) {
  if (key === 'ShiftLeft' || key === 'ShiftRight' || key === 'CapsLock' || key === 'ControlLeft' || key === 'AltLeft' || key === 'ControlRight' || key === 'AltRight' || key === 'MetaLeft') {
    if (keyboard.specialKeys[key]) {
      keyboard.specialKeys[key] = false;
    } else {
      keyboard.specialKeys[key] = true;
    }
  }
}

function changeSpecialKeysAnimation(key) {
  if (keyboard.specialKeys[key] === true) {
    addActiveButton(key);
  } else {
    removeActiveButton(key);
  }
}

function changeLangIfNeed() {
  if (keyboard.toChangeKeyboard === true) {
    keyboard.toChangeKeyboard = false;
    const keys = Object.keys(keyboard.specialKeys);
    for (let i = 0; i < keys.length; i += 1) {
      if (keys[i] !== 'CapsLock') keyboard.specialKeys[keys[i]] = false;
    }
    keyboard.changeKeyboard();
    return true;
  }
  return false;
}

function mouseUpEvent(e) {
  if (!e.target.classList.contains('keyboard')) {
    let node;
    if (e.target.classList.contains('keyboard_btn')) {
      node = e.target;
    } else {
      node = e.target.parentNode;
    }
    const key = node.getAttribute('id');
    specialKeysStateSwitch(key);
    changeSpecialKeysAnimation(key);
    checkOfNeedChangeKeyboard(key);
    changeLangIfNeed();
    keyboard.print(key);
  }
}

function addMouseListener() {
  document.getElementById('keyboard').addEventListener('mouseup', mouseUpEvent);
}

function keyUpEvent(e) {
  const key = e.code;
  specialKeysStateOff(key);
  removeActiveButton(key);
  changeLangIfNeed();
  e.preventDefault();
}

function addHandlers() {
  document.addEventListener('keydown', keyDownEvent);
  document.addEventListener('keyup', keyUpEvent);
  addMouseListener();
}

addHandlers();
