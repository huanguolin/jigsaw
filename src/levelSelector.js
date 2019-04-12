import { createElement } from './util';

export default class LevelSelector {

    constructor(parent, levels, levelMap, gameReady) {
        var self = this;
        var div = createElement('div');
        var h3 = createElement('h2');
        var ul = createElement('ul');
        var customInput = self._genCustomInput();
        h3.innerHTML = 'Select the Level of Difficulty';
        levels.forEach(function (item) {
            var li = createElement('li');
            li.innerHTML = item;
            li.addEventListener('click', function (e) {
                e.stopPropagation();
                if (item === 'custom') {
                    self.customInput.style.display = 'block';
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
        self.customInput = customInput;
        self.gameReady = gameReady;
        self.root = div;
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
        var self = this;
        var root = createElement('ul');
        root.classList.add('custom-input');
        var genInputItem = function (name) {
            var li = createElement('li');
            var span = createElement('span');
            span.innerHTML = name;
            li.appendChild(span);
            var input = createElement('input');
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
        var row = genInputItem('Row');
        var col = genInputItem('Column');
        var confirm = createElement('li');
        var button = createElement('button');
        button.innerHTML = 'OK';
        button.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!self.gameReady)
                return;
            var level = {
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
