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
        const root = this._createRootAndSetElem();
        this.customInput = this._genCustomInput();
        root.appendChild(this._createTitle());
        root.appendChild(this._createLevelList(this.levels, this.levelMap));
        root.appendChild(this.customInput);
        return root;
    }

    _createLevelList(levels, levelMap) {
        return levels.reduce((ul, level) => {
            const listItem = this._createLevelListItem(level, levelMap);
            ul.appendChild(listItem);
            return ul;
        }, createElement('ul'));
    }

    _createLevelListItem(item, levelMap) {
        const li = createElement('li');
        li.innerHTML = item;
        li.addEventListener('click', e => {
            e.stopPropagation();
            if (item === 'custom') {
                this.customInput.style.display = 'block';
                return;
            }
            if (this.gameReady) {
                this.gameReady(levelMap[item]);
            }
        }, false);
        return li;
    }

    _createTitle() {
        const h2 = createElement('h2');
        h2.innerHTML = 'Select the Level of Difficulty';
        return h2;
    }

    _createRootAndSetElem() {
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

    open() {
        this.show = true;
        this.customInput.style.display = 'none';
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
