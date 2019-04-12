import { createElement } from './util';

export default class LevelSelector {

    constructor(parent, levels, levelMap, gameReady) {
        this.gameReady = gameReady;        
        
        const div = createElement('div');
        div.classList.add('jigsaw-level-selector');
        div.style.display = 'none';
        
        const h2 = createElement('h2');
        h2.innerHTML = 'Select the Level of Difficulty';
        div.appendChild(h2);

        const ul = createElement('ul');
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
        div.appendChild(ul);
        

        const customInput = this._genCustomInput();
        div.appendChild(customInput);
        this.customInput = customInput;

        parent.appendChild(div);
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
