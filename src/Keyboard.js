import keyboardLayout from './data';

export default class Keyboard{
    constructor() {
        this.text = '';
        this.buttonsArray=[];
        this.toChangeKeyboard=false;
        this.specialKeys = {
            ShiftLeft: false,
            ShiftRight: false,
            CapsLock: false,
            ControlLeft: false,
            AltLeft: false,
            ControlRight: false,
            AltRight: false,
            MetaLeft: false
        }
        this.getKeys(this.getLang());
        this.textarea = document.querySelector('textarea');
    }

    getLang(){
        if (localStorage.getItem('lang')==null){
            localStorage.setItem('lang', 'en');
        }
        console.log('load '+ localStorage.getItem('lang'));
        return localStorage.getItem('lang');
    }

    
    changeLang(){
        if(localStorage.getItem('lang')=='ru'){
            localStorage.setItem('lang', 'en');
        }else{
            localStorage.setItem('lang', 'ru');
        }
        this.getKeys(this.getLang());
        //console.log('changeLang to '+(localStorage.getItem('lang')));
    }

    getKeys(lang){
        if (lang=='ru'){
            this.buttonsArray = keyboardLayout.ru;
        } else {
            this.buttonsArray = keyboardLayout.en;
        }
    }

    switchKeyboard(){
        //create keyboard;
        let content = document.getElementsByClassName('content')[0];
        let keyboard = document.getElementsByClassName('keyboard')[0];
        
        let kbrdbtn, first, second;
        for (let i=0; i<this.buttonsArray.length; i++){
            kbrdbtn=document.createElement('div');
            
            kbrdbtn.className='keyboard_btn ' + 'keyboard_btn_' + this.buttonsArray[i][0] + ' ' +this.buttonsArray[i][1] + ' en';
            kbrdbtn.setAttribute('id', this.buttonsArray[i][0]);
            
            if(this.buttonsArray[i][1]=='special'){
                kbrdbtn.innerHTML=this.buttonsArray[i][2];
            }else{
                first=document.createElement('div');
                first.className='keyboard_btn_shift';
                first.innerHTML=this.buttonsArray[i][2][1];
                kbrdbtn.appendChild(first);
                
                second=document.createElement('div');
                second.className='keyboard_btn_simple';
                second.innerHTML=this.buttonsArray[i][2][0];
                kbrdbtn.appendChild(second);
            }
            keyboard.append(kbrdbtn);
        }

        //navigation
        let nav=[['ArrowLeft', 'special', 'left'],
                ['ArrowUp', 'special', 'up'],
                ['ArrowDown', 'special', 'down'],
                ['ArrowRight', 'special', 'right']];
    
        let btnLeft=document.createElement('div');
        btnLeft.className='keyboard_btn ' + 'keyboard_btn_' + nav[0][0] + ' ' +nav[0][1];
        btnLeft.setAttribute('id', nav[0][0]);
        btnLeft.innerHTML=nav[0][2];
        keyboard.append(btnLeft);
    
        let btnUp=document.createElement('div');
        btnUp.className='keyboard_btn ' + 'keyboard_btn_' + nav[1][0] + ' ' +nav[1][1];
        btnUp.setAttribute('id', nav[1][0]);
        btnUp.innerHTML=nav[1][2];
    
        let btnDown=document.createElement('div');
        btnDown.className='keyboard_btn ' + 'keyboard_btn_' + nav[2][0] + ' ' +nav[2][1];
        btnDown.setAttribute('id', nav[2][0]);
        btnDown.innerHTML=nav[2][2];
    
        let double=document.createElement('div');
        double.className='keyboard_btn_up_down';
        double.appendChild(btnUp);
        double.appendChild(btnDown);
        keyboard.append(double);
    
        let btnRight=document.createElement('div');
        btnRight.className='keyboard_btn ' + 'keyboard_btn_' + nav[3][0] + ' ' +nav[3][1];
        btnRight.setAttribute('id', nav[3][0]);
        btnRight.innerHTML=nav[3][2];
    
        keyboard.append(btnRight);
        
    }

    changeKeyboard(){
        this.changeLang();
        document.getElementById('keyboard').classList.add('keyboard_hide');
        setTimeout(() => {
            document.getElementById('keyboard').classList.remove('keyboard_hide');
            let buttons = document.getElementById('keyboard').childNodes;
            for (let i = buttons.length - 1; i > 0; i -= 1) {
                buttons[i].remove();
            }
            this.switchKeyboard();
        }, 500);
    }

    print(key){
        textarea.focus();
        
        if (key != 'ShiftLeft' && key != 'ShiftRight' && key != 'CapsLock' && key != 'ControlLeft' && key != 'AltLeft' && key != 'ControlRight' && key != 'AltRight' && key != 'MetaLeft'){
            let k = 0;
            if(key == 'Tab'){
                this.addSybmol('\t');
            }else if (key=='Enter'){
                this.addSybmol('\n');
            }else if(key === 'Backspace' || key ==='Delete'){
               this.removeSymbol(key);
            }else if (key === 'ArrowRight' || key === 'ArrowLeft' || key === 'ArrowUp' || key === 'ArrowDown') {
                this.moveCursor(key);
            } else {
                if (this.specialKeys.CapsLock) {
                    if(!this.specialKeys.ShiftLeft && !this.specialKeys.ShiftRight) {
                        k = 1;
                    }
                } else {
                    if (this.specialKeys.ShiftLeft || this.specialKeys.ShiftRight) {
                        k = 1;
                    }
                }
                let symbol = this.getSymbol(key,k);
                if (symbol) this.addSybmol(symbol);
            }
        }
    }

    moveCursor(button) {
        let move, firstEndOfString, secondEndOfString;
        let position = this.textarea.selectionStart;
        switch (button) {
            case 'ArrowRight':
                move = 1;
                break;
            case  'ArrowLeft':
                move = -1;
                break;
            case 'ArrowUp':
                firstEndOfString = this.text.substring(0, position).lastIndexOf('\n');
                if (firstEndOfString === -1) {
                    move = 0;
                } else {
                    secondEndOfString = this.text.substring(0, firstEndOfString).lastIndexOf('\n');
                }
                
                if (position - firstEndOfString > 72){
                    move = 72;
                } else if (firstEndOfString - secondEndOfString > 72) {
                    move = 73;
                } else {
                    if (position - firstEndOfString > firstEndOfString - secondEndOfString) {
                        move = position - firstEndOfString;
                    } else {
                        move = position - (secondEndOfString + (position - firstEndOfString))
                    }
                }
                move = -move;
                break;
            case 'ArrowDown':
                let previousEndOfString = this.text.substring(0, position).lastIndexOf('\n');
                if (previousEndOfString === -1) previousEndOfString = 0;
                let positionInRow = (position - previousEndOfString) % 72;
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
                    
                    // if (secondEndOfString - position > 72) {
                    //     move = 72;
                    // } else {
                    //     move = secondEndOfString - position + ((position - previousEndOfString) % 72);
                    // }
                }
                break;
        }

        let start = document.getElementById('textarea').selectionStart;
        if (start + move < 0) {
            document.getElementById('textarea').selectionEnd = 0;
            document.getElementById('textarea').selectionStart = 0;
        } else {
            document.getElementById('textarea').selectionEnd = start + move;
            document.getElementById('textarea').selectionStart = start + move;
        }
        console.log(document.getElementById('textarea').selectionStart);
        this.textarea.focus();
    }

    addSybmol (symbol) {
        let start = document.getElementById('textarea').selectionStart;
        let end = document.getElementById('textarea').selectionEnd;
        this.text = this.text.substring(0, start) + symbol + this.text.substring(end, this.text.length);
        this.textarea.innerHTML = this.text;
        document.getElementById('textarea').selectionEnd = start + 1;
        document.getElementById('textarea').selectionStart = start + 1;
    }

    removeSymbol (key) {
        let start = document.getElementById('textarea').selectionStart;
        let end = document.getElementById('textarea').selectionEnd;
        let shift;
        if (start === end) {
            shift = 1;
        } else {
            shift = 0;
        }
        if (key === 'Delete') {
            this.text = this.text.substring(0, start) + this.text.substring(end + shift, this.text.length);
            this.textarea.innerHTML = this.text;
            document.getElementById('textarea').selectionEnd = start;
            document.getElementById('textarea').selectionStart = start;        
        } else {
            this.text = this.text.substring(0, start - shift) + this.text.substring(end, this.text.length);
            this.textarea.innerHTML = this.text;
            document.getElementById('textarea').selectionEnd = start - shift;
            document.getElementById('textarea').selectionStart = start - shift;
        }
    }

    getSymbol(key, k){
        if (key === 'Space') {
            k = 0;
        }

        for (let i = 0; i < this.buttonsArray.length; i += 1) {
            if (this.buttonsArray[i][0] === key) {
                return this.buttonsArray[i][2][k];
            }
        }

        return null;
    }
}