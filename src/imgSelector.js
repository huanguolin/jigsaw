import { createElement } from './util';

class ImgSelector {

    constructor() {
        this.root = null;
        this.catchImg = null;
    }

    get show() {
        return this.root.style.display !== 'none';
    }
    set show(val) {
        this.root.style.display = val ? 'block' : 'none';
    }

    init(parent, catchImg) {
        var self = this;

        var div = createElement('div');
        var span = createElement('span');

        span.innerHTML = 'Drag Picture Here or Click to Select';
        div.classList.add('jigsaw-img-selector');
        div.style.display = 'none';

        // events
        var handleDragOver = function (e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        };
        var handleDrop = function (e) {
            e.stopPropagation();
            e.preventDefault();

            var catchImg = self.catchImg;
            var files = e.dataTransfer.files;
            self._getImgFile(files, catchImg);
        };
        var handleClick = function (e) {
            e.stopPropagation();
            e.preventDefault();

            var input = e.currentTarget.querySelector('input');
            input.click();
        };
        div.addEventListener('dragover', handleDragOver, false);
        div.addEventListener('drop', handleDrop, false);
        div.addEventListener('click', handleClick, false);

        div.appendChild(span);
        parent.appendChild(div);

        self.catchImg = catchImg;
        self.root = div;
    }

    open() {
        const input = this._createAndSetInputElem(); 

        // replace old input or add new input,
        // do this to avoid input change not trigger 
        // when user choose same file
        const oldInput = this.root.querySelector('input');
        if (oldInput) {
            this.root.replaceChild(input, oldInput);
        } else {
            this.root.appendChild(input);
        }

        this.show = true;
    }

    close() {
        this.show = false;
    }

    _createAndSetInputElem() {
        const input = createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.style.display = 'none';
        input.addEventListener('change', e => {
            e.stopPropagation();
            e.preventDefault();
            this._getImgFile(e.target.files);
        }, false);
        // avoid dead loop with parent click
        input.addEventListener('click', e => e.stopPropagation(), false);
        return input;
    }

    _getImgFile(files) {
        if (files.length > 0 && this.catchImg) {
            this.catchImg(window.URL.createObjectURL(files[0]));
        }
    }
}

export default new ImgSelector();
