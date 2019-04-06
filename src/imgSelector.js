import { createElement } from './util';

class ImgSelector {

    constructor() {
        this.root = null;
        this.catchImg = null;
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
            getFile(files, catchImg);
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
        var self = this;

        // create new input
        var input = createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.style.display = 'none';

        // events
        var handleChange = function (e) {
            e.stopPropagation();
            e.preventDefault();

            var catchImg = self.catchImg;
            var files = e.target.files;
            getFile(files, catchImg);
        }
        var handleClick = function (e) {
            e.stopPropagation();
        };
        input.addEventListener('change', handleChange, false);
        input.addEventListener('click', handleClick, false); // avoid dead loop with parent click

        // replace old input or add new input,
        // do this to avoid input change not trigger 
        // when user choose same file
        var el = self.root;
        var oldInput = el.querySelector('input');
        if (oldInput) el.replaceChild(input, oldInput);
        else el.appendChild(input);

        // show imgSelector
        el.style.display = 'block';
    }

    close() {
        // hide imgSelector
        this.root.style.display = 'none';
    }
}

export default new ImgSelector();

function getFile(files, catchImg) {
    if (files.length > 0 && catchImg) {
        var url = window.URL.createObjectURL(files[0]);
        catchImg(url);
    }
}
