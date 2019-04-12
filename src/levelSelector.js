import { createElement } from './util';

export default class LevelSelector {

    constructor(parent, levels, levelMap, gameReady) {
        const div = createElement('div');
        const h3 = createElement('h2');
        const ul = createElement('ul');
        const customInput = this._genCustomInput();
        h3.innerHTML = 'Select the Level of Difficulty';
        levels.forEach(item => {
            const li = createElement('li');
            li.innerHTML = item;
            li.addEventListener('click', e => {
                e.stopPropagation();
                if (item === 'custom') {
                    this.customInput.style.display = 'block';
                    return;
                }
                if (gameReady)
                    gameReady(levelMap[item]);
            }, false);
            ul.appendChild(li);
        });
        div.classList.add('jigsaw-level-selector');
        div.style.display = 'none';
        div.appendChild(h3);
        div.appendChild(ul);
        div.appendChild(customInput);
        parent.appendChild(div);
        this.customInput = customInput;
        this.gameReady = gameReady;
        this.root = div;
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
        const self = this;
        const root = createElement('ul');
        root.classList.add('custom-input');
        const genInputItem = function (name) {
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
        };
        const row = genInputItem('Row');
        const col = genInputItem('Column');
        const confirm = createElement('li');
        const button = createElement('button');
        button.innerHTML = 'OK';
        button.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!self.gameReady)
                return;
            const level = {
                row: row.input.value,
                col: col.input.value,
            };
            self.gameReady(level);
        }, false);
        confirm.appendChild(button);
        root.appendChild(row.li);
        root.appendChild(col.li);
        root.appendChild(confirm);
        return root;
    }
}
