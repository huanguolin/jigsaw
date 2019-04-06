import { createElement } from './util';

class ImgSelector {

    constructor() {
        this.root = null;
        this.catchImg = null;
    }

    get isInit() {
        return this.root && this.root instanceof Element;
    }

    get show() {
        this._detectInit();
        return this.root.style.display !== 'none';
    }

    set show(val) {
        this._detectInit();
        this.root.style.display = val ? 'block' : 'none';
    }

    init(parent, catchImg) {
        this.catchImg = catchImg;
        this.root = this._createAndSetRootDiv();
        this.root.appendChild(this._createAndSetSpan());
        parent.appendChild(this.root);
    }

    open() {
        this._detectInit();
        
        // replace old input or add new input,
        // do this to avoid input change not trigger 
        // when user choose same file
        const oldInput = this.root.querySelector('input');        
        const input = this._createAndSetInputElem(); 
        if (oldInput) {
            this.root.replaceChild(input, oldInput);
        } else {
            this.root.appendChild(input);
        }

        this.show = true;
    }

    close() {
        this._detectInit();
        this.show = false;
    }
    
    _detectInit() {
        if (!this.isInit) {
            throw new Error('Need init first!');
        }
    }

    _createAndSetSpan() {
        const span = createElement('span');
        span.innerHTML = 'Drag Picture Here or Click to Select';
        return span;
    }

    _createAndSetRootDiv() {
        const div = createElement('div');
        div.classList.add('jigsaw-img-selector');
        div.style.display = 'none';
        // events
        div.addEventListener('dragover', e => {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }, false);
        div.addEventListener('drop', e => {
            e.stopPropagation();
            e.preventDefault();
            var catchImg = this.catchImg;
            var files = e.dataTransfer.files;
            this._notifyGotImgFile(files, catchImg);
        }, false);
        div.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            var input = e.currentTarget.querySelector('input');
            input.click();
        }, false);
        return div;
    }

    _createAndSetInputElem() {
        const input = createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.style.display = 'none';
        input.addEventListener('change', e => {
            e.stopPropagation();
            e.preventDefault();
            this._notifyGotImgFile(e.target.files);
        }, false);
        // avoid dead loop with parent click
        input.addEventListener('click', e => e.stopPropagation(), false);
        return input;
    }

    _notifyGotImgFile(files) {
        if (files.length > 0 && this.catchImg) {
            this.catchImg(window.URL.createObjectURL(files[0]));
        }
    }
}

export default new ImgSelector();
