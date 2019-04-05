import {
    createElement,
    str,
    random,
    setDomData,
    getDomData,
    partEqual,
    getElemOffset,
    getElemSize,
} from './util';

export default {
    root: null,
    playground: null,
    pause: null,
    loading: null,
    panel: null,
    size: {
        w: 0,
        h: 0
    },
    gameEnd: null,
    imgUrl: null,
    difficulty: {
        row: 0,
        col: 0,
    },
    draggableElems: [],
    draggingIndex: -1,
    overIndex: -1,
    totalSteps: 0,
    completeSteps: 0,
    gameFinished: null,
    // below only for touch events
    playgroundOffset: null,
    pieceSize: null,
    // operations 
    init: function (parent, size, panel, gameEnd) {
        var self = this;
        self.size = size;
        self.gameEnd = gameEnd;
        // initialize
        var root = createElement('div');
        var pause = createElement('div');
        var loading = createElement('div');
        var playground = createElement('div');
        playground.classList.add('playground');
        pause.classList.add('pause');
        root.classList.add('jigsaw-game-playground');
        root.style.display = 'none';
        root.appendChild(playground);
        root.appendChild(pause);
        root.appendChild(loading);
        parent.appendChild(root);
        panel.init(root, {
            play: function () {
                pause.style.display = 'none';
            },
            pause: function () {
                pause.style.opacity = '.5';
                pause.style.display = 'block';
            },
            close: function () {
                var msg = 'The game is not over. Do you really want to leave?';
                if (self.totalSteps > self.completeSteps) {
                    if (!window.confirm(msg)) {
                        return;
                    }
                }
                self.gameEnd();
                // hide 
                self.root.style.display = 'none';
                self.panel.close();
                // clean
                self.playground.innerHTML = '';
                self.draggableElems = [];
                self.draggingIndex = -1;
                self.overIndex = -1;
                pause.style.display = 'none';
            },
        });
        self.root = root;
        self.playground = playground;
        self.pause = pause;
        self.loading = loading;
        self.panel = panel;
    },
    serve: function (imgUrl, difficulty) {
        var self = this;
        self.imgUrl = imgUrl;
        self.difficulty = difficulty;
        self.totalSteps = difficulty.row * difficulty.col;
        self.completeSteps = 0;
        var img = new Image();
        img.onload = function () {
            self.loading.classList.remove('loading');
            var imgSize = {
                w: img.width,
                h: img.height,
            };
            var scaleSize = self._genImgPieces(imgSize);
            var panelLeft = (self.size.w - scaleSize.w) / 2 - self.panel.WIDTH;
            var locate = {
                left: panelLeft
            };
            var step = {
                total: self.totalSteps,
                complete: self.completeSteps,
            };
            self.panel.open(locate, step);
            self.gameFinished = function () {
                self.difficulty = {
                    row: 1,
                    col: 1,
                };
                self._genImgPieces(imgSize);
                self.pause.style.opacity = '0';
                self.pause.style.display = 'block';
                // clean dragging states
                self.draggingIndex = -1;
                self.overIndex = -1;
            };
        };
        img.src = imgUrl;
        self.loading.classList.add('loading');
        self.root.style.display = 'block';
    },
    // inner functions
    _genImgPieces: function (imgSize) {
        var self = this;
        var maxW = self.size.w;
        var maxH = self.size.h;
        var imgW = imgSize.w;
        var imgH = imgSize.h;
        var row = self.difficulty.row;
        var col = self.difficulty.col;
        var scaledSize = self._computeImgDisplaySize(imgW, imgH, maxW, maxH);
        var panelWidth = self.panel.WIDTH;
        var panelGap = (maxW - scaledSize.w) / 2;
        if (panelGap < panelWidth) {
            maxW -= (panelWidth - panelGap) * 2;
            scaledSize = self._computeImgDisplaySize(imgW, imgH, maxW, maxH);
        }
        var sw = scaledSize.w;
        var sh = scaledSize.h;
        var pw = sw / col; // piece size
        var ph = sh / row;
        // create wrappers & pieces
        var wrappers = [];
        var pieces = [];
        var position = null;
        var i, j;
        for (i = 0; i < row; i++) {
            for (j = 0; j < col; j++) {
                position = {
                    row: i,
                    col: j,
                };
                pieces.push(self._genPiece(position, sw, sh, pw, ph));
                wrappers.push(self._genWrapper(position));
            }
        }
        // set draggable elements
        self.draggableElems = wrappers;
        // change playground looks
        var playground = self.playground;
        var fragment = self._messPieces(wrappers, pieces);
        playground.style.width = sw + 'px';
        playground.style.height = sh + 'px';
        playground.innerHTML = '';
        playground.appendChild(fragment);
        return scaledSize;
    },
    _messPieces: function (wrappers, pieces) {
        var self = this;
        var fragment = document.createDocumentFragment();
        wrappers.forEach(function (w) {
            var i = random(0, pieces.length);
            var p = pieces[i];
            pieces.splice(i, 1); // remove it
            // make sure it position not equal           
            var wp = getDomData(w, 'position');
            var pp = getDomData(p, 'position');
            if (partEqual(['row', 'col'], wp, pp)) {
                if (pieces.length > 0) {
                    // this one can not equal any more
                    i = random(0, pieces.length);
                    pieces.push(p);
                    p = pieces[i];
                    pieces.splice(i, 1);
                } else {
                    self.completeSteps++;
                }
            }
            w.appendChild(p);
            fragment.appendChild(w);
        });
        return fragment;
    },
    _computeImgDisplaySize: function (imgW, imgH, maxW, maxH) {
        var tanS = imgH / imgW;
        var tanD = maxH / maxW;
        var w, h;
        if (tanS > tanD) {
            h = imgH > maxH ? maxH : imgH;
            w = h / tanS;
        } else {
            w = imgW > maxW ? maxW : imgW;
            h = w * tanS;
        }
        return {
            w: w,
            h: h,
        };
    },
    _genWrapper: function (position) {
        var self = this;
        var handler = this.handler;
        var div = createElement('div');
        div.classList.add('piece-wrapper');
        div.setAttribute('draggable', 'true');
        setDomData(div, 'position', position);
        self._handleDragDropEvent(div); // for mouse device
        self._handleTouchEvent(div); // for touch device             
        return div;
    },
    _handleDragDropEvent: function (wrapper) {
        var self = this;
        var handleDragStart = function (e) {
            self.draggingIndex = self.draggableElems.indexOf(this);
            this.style.opacity = '.9';
            this.style.transform = 'scale(.8, .8)';
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData('text/html', this.innerHTML);
        };
        var handleDragOver = function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        };
        var handleDragEnter = function (e) {
            var draggingElem = self.draggableElems[self.draggingIndex];
            if (draggingElem !== this) {
                this.classList.add('drag-over');
                self.overIndex = self.draggableElems.indexOf(this);
            }
        };
        var handleDragLeave = function (e) {
            this.classList.remove('drag-over');
        };
        var handleDrop = function (e) {
            e.preventDefault();
            e.stopPropagation();
            var draggingElem = self.draggableElems[self.draggingIndex];
            if (draggingElem !== this) {
                draggingElem.innerHTML = this.innerHTML;
                this.innerHTML = e.dataTransfer.getData('text/html');
                self._judgeProgress(draggingElem, this);
            }
        };
        var handleDragEnd = function (e) {
            if (self.overIndex > -1) {
                var lastOverElem = self.draggableElems[self.overIndex];
                lastOverElem.classList.remove('drag-over');
                self.overIndex = -1;
            }
            if (self.draggingIndex > -1) {
                var draggingElem = self.draggableElems[self.draggingIndex];
                draggingElem.style.opacity = '1';
                draggingElem.style.transform = 'none';
                self.draggingIndex = -1;
            }
        };
        wrapper.addEventListener('dragstart', handleDragStart, false);
        wrapper.addEventListener('dragover', handleDragOver, false);
        wrapper.addEventListener('dragenter', handleDragEnter, false);
        wrapper.addEventListener('dragleave', handleDragLeave, false);
        wrapper.addEventListener('drop', handleDrop, false);
        wrapper.addEventListener('dragend', handleDragEnd, false);
    },
    _handleTouchEvent: function (wrapper) {
        var self = this;
        var handleTouchStart = function (e) {
            this.style.opacity = '0.4';
            this.style.transform = 'scale(.8, .8)';
            self.draggingIndex = self.draggableElems.indexOf(this);
            self.overIndex = self.draggingIndex;
            if (!self.playgroundOffset)
                self.playgroundOffset = getElemOffset(this.parentNode);
            if (!self.pieceSize)
                self.pieceSize = getElemSize(this);
        };
        var handleTouchMove = function (e) {
            e.preventDefault();
            var touch = e.touches[0];
            var x = touch.pageX - self.playgroundOffset.left;
            var y = touch.pageY - self.playgroundOffset.top;
            var row = Math.floor(y / self.pieceSize.height);
            var col = Math.floor(x / self.pieceSize.width);
            var rowCnt = self.difficulty.row;
            var total = rowCnt * self.difficulty.col;
            var newOverIndex = row * rowCnt + col;
            if (newOverIndex >= total || newOverIndex < 0)
                newOverIndex = -1;
            if (newOverIndex != self.overIndex) {
                // drag enter 
                if (newOverIndex > -1 && newOverIndex != self.draggingIndex) {
                    self.draggableElems[newOverIndex].classList.add('drag-over');
                }
                // drag leave 
                if (self.overIndex > -1 && self.overIndex != self.draggingIndex) {
                    self.draggableElems[self.overIndex].classList.remove('drag-over');
                }
                self.overIndex = newOverIndex;
            }
        };
        var handleTouchEnd = function (e) {
            var dragElem = self.draggableElems[self.draggingIndex];
            dragElem.style.opacity = '1';
            dragElem.style.transform = 'none';
            // drop 
            if (self.overIndex > -1 && self.overIndex != self.draggingIndex) {
                var target = self.draggableElems[self.overIndex];
                var tmp = dragElem.innerHTML;
                dragElem.innerHTML = target.innerHTML;
                target.innerHTML = tmp;
                target.classList.remove('drag-over');
                // update progress
                self._judgeProgress(dragElem, target);
            }
        };
        wrapper.addEventListener('touchstart', handleTouchStart, false);
        wrapper.addEventListener('touchmove', handleTouchMove, false);
        wrapper.addEventListener('touchend', handleTouchEnd, false);
    },
    _genPiece: function (position, sw, sh, pw, ph) {
        var sx = pw * position.col;
        var sy = ph * position.row;
        var div = createElement('div');
        div.classList.add('piece');
        div.style.width = str(pw, 'px');
        div.style.height = str(ph, 'px');
        div.style.backgroundImage = str('url(', this.imgUrl, ')');
        div.style.backgroundSize = str(sw, 'px ', sh, 'px');
        div.style.backgroundPosition = str('-', sx, 'px ', '-', sy, 'px');
        div.style.backgroundRepeat = 'no-repeat';
        setDomData(div, 'position', position);
        return div;
    },
    _judgeProgress: function (wa, wb) {
        var pa = wa.firstChild;
        var pb = wb.firstChild;
        var wap = getDomData(wa, 'position');
        var wbp = getDomData(wb, 'position');
        var pap = getDomData(pa, 'position');
        var pbp = getDomData(pb, 'position');
        var keys = ['row', 'col'];
        var aBefore = partEqual(keys, wap, pbp);
        var aAfter = partEqual(keys, wap, pap);
        var bBefore = partEqual(keys, wbp, pap);
        var bAfter = partEqual(keys, wbp, pbp);
        var change;
        var total = 0;
        if (aBefore !== aAfter) {
            change = aBefore ? -1 : 1;
            total += change;
        }
        if (bBefore !== bAfter) {
            change = bBefore ? -1 : 1;
            total += change;
        }
        if (0 !== total) {
            this.completeSteps += total;
            this._gameForward();
        }
    },
    _gameForward: function () {
        var self = this;
        var step = {
            total: self.totalSteps,
            complete: self.completeSteps,
        };
        self.panel.updateSteps(step);
        if (self.totalSteps === self.completeSteps) {
            self.gameFinished();
            self.panel.done();
        }
    }
};