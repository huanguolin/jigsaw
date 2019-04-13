import { createElement } from './util';

export default class LevelSelector {

    constructor(parent, levels, levelMap, gameReady) {
        this.levels = levels;
        this.levelMap = levelMap;
        this.gameReady = gameReady;

        this.root = this._createAndSetRootElem();
        parent.appendChild(this.root);
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
                return;
            }
            if (this.gameReady) {
                this.gameReady(this.levelMap[item]);
            }
        }, false);
        return li;
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

    get show() {
        return this.root.style.display !== 'none';
    }

    set show(val) {
        this.root.style.display = val ? 'block' : 'none';
    }

    _showCustomInput() {
        this._customInput.style.display = 'block';
    }

    _hideCustomInput() {
        this._customInput.style.display = 'none';
    }

    open() {
        this.show = true;
        this._hideCustomInput();
    }

    close() {
        this.show = false;
    }

    _genCustomInput() {
        const root = createElement('ul');
        root.classList.add('custom-input');
        const row = this._genInputItem('Row');
        const col = this._genInputItem('Column');
        const confirm = createElement('li');
        const button = createElement('button');
        button.innerHTML = 'OK';
        button.addEventListener('click', e => {
            e.stopPropagation();
            if (this.gameReady) {
                const level = {
                    row: row.input.value,
                    col: col.input.value,
                };
                this.gameReady(level);
            }
        }, false);
        confirm.appendChild(button);
        root.appendChild(row.li);
        root.appendChild(col.li);
        root.appendChild(confirm);
        return root;
    }
    
    _genInputItem(name) {
        const li = createElement('li');
        const span = createElement('span');
        span.innerHTML = name;
        li.appendChild(span);
        const input = createElement('input');
        input.setAttribute('type', 'number');
        input.setAttribute('min', 2);
        input.setAttribute('max', 10);
        input.setAttribute('value', 4);
        li.appendChild(input);
        return {
            li: li,
            input: input
        };
    }
}
