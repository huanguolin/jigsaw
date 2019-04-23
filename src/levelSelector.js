import { createElement } from './util';

export default class LevelSelector {

    constructor(parent, levels, levelMap, gameReady) {
        this.levels = levels;
        this.levelMap = levelMap;
        this.gameReady = gameReady;

        this.root = this._createAndSetRootElem();
        parent.appendChild(this.root);
    }

    get show() {
        return this.root.style.display !== 'none';
    }

    set show(val) {
        this.root.style.display = val ? 'block' : 'none';
    }

    open() {
        this.show = true;
        this._hideCustomInput();
    }

    close() {
        this.show = false;
    }

    _createAndSetRootElem() {
        const root = this._createRootElem();
        this._customInput = this._genCustomInput();
        root.appendChild(this._createTitle());
        root.appendChild(this._createLevelList());
        root.appendChild(this._customInput);
        return root;
    }

    _createLevelList() {
        return this.levels.reduce((ul, level) => {
            ul.appendChild(this._createLevelListItem(level));
            return ul;
        }, createElement('ul'));
    }

    _createLevelListItem(item) {
        const li = createElement('li');
        li.innerHTML = item;
        li.addEventListener('click', e => {
            e.stopPropagation();
            if (item === 'custom') {
                this._showCustomInput();
            } else {
                this._notifySelectedLevel(item);
            }
        }, false);
        return li;
    }

    _notifySelectedLevel(item) {
        if (this.gameReady) {
            this.gameReady(this._getLevel(item));
        }
    }

    _getLevel(item) {        
        return this.levelMap[item];
    }

    _createTitle() {
        const h2 = createElement('h2');
        h2.innerHTML = 'Select the Level of Difficulty';
        return h2;
    }

    _createRootElem() {
        const root = createElement('div');
        root.classList.add('jigsaw-level-selector');
        root.style.display = 'none';
        return root;
    }

    _showCustomInput() {
        this._customInput.style.display = 'block';
    }

    _hideCustomInput() {
        this._customInput.style.display = 'none';
    }

    _genCustomInput() {
        const ul = createElement('ul');
        ul.classList.add('custom-input');
        const row = this._genInputItem('Row');
        const col = this._genInputItem('Column');
        const confirm = this._genConfirm(row.input, col.input);
        ul.appendChild(row.li);
        ul.appendChild(col.li);
        ul.appendChild(confirm);
        return ul;
    }
    
    _genConfirm(rowInput, colInput) {
        const button = createElement('button');
        button.innerHTML = 'OK';
        button.addEventListener('click', e => {
            e.stopPropagation();
            if (this.gameReady) {
                this.gameReady({
                    row: rowInput.value,
                    col: colInput.value,
                });
            }
        }, false);
        const confirm = createElement('li');
        confirm.appendChild(button);
        return confirm;
    }

    _genInputItem(name) {
        const span = this._createInputLabelElem(name);
        const input = this._createInputElem();
        const li = createElement('li');
        li.appendChild(span);
        li.appendChild(input);
        return {
            li,
            input,
        };
    }

    _createInputLabelElem(name) {
        const span = createElement('span');
        span.innerHTML = name;
        return span;
    }

    _createInputElem() {
        const input = createElement('input');
        input.setAttribute('type', 'number');
        input.setAttribute('min', 2);
        input.setAttribute('max', 10);
        input.setAttribute('value', 4);
        return input;
    }
}
