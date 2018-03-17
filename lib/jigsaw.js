(function (context) {

    var createElement = document.createElement.bind(document); 
    var error = console.error.bind(error);
     
    var imgSelector = {   
        root: null,  
        catchImg: null,      

        // operations 
        init: function (parent, catchImg) {
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
                if (files.length > 0 && catchImg) {
                    var url = context.URL.createObjectURL(files[0]);
                    catchImg(url);
                } 
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
        },
        open: function () {
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
                if (files.length > 0 && catchImg) {
                    var url = context.URL.createObjectURL(files[0]);
                    catchImg(url);
                }
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
        },
        close: function () {
            // hide imgSelector
            this.root.style.display = 'none';
        },
    };

    var levelSelector = {
        root: null,        

        // operations 
        init: function (parent, levels, levelMap, gameReady) {
            var self = this;
            var div = createElement('div');
            var h3 = createElement('h2');
            var ul = createElement('ul');
            
            h3.innerHTML = 'Select the Level of Difficulty';
            levels.forEach(function (item) {
                var li = createElement('li');
                li.innerHTML = item;
                li.addEventListener('click', function (e) {
                    e.stopPropagation();
                    if (gameReady) gameReady(levelMap[item])
                }, false);
                ul.appendChild(li);
            });
            div.classList.add('jigsaw-level-selector');
            div.style.display = 'none';

            div.appendChild(h3);
            div.appendChild(ul);
            parent.appendChild(div);

            self.root = div;
        },
        open: function () {
            this.root.style.display = 'block';
        },
        close: function () {
            this.root.style.display = 'none';
        },
    };

    var gamePanel = {
        // const
        WIDTH: 50,
        ITEMS_CNT: 4,// time/step/play&pause/close

        // inner attrs
        handler: {
            play: null,
            pause: null,
            close: null, 
        },
        root: null,
        items: [], 
        state: '', // play/pause/done      
        timer: {
            el: null,
            time: 0, // second
            timerId: null,
            state: '', // play/pause
            init: function (timerEl) {
                this.el = timerEl;
                this.time = 0;
            },
            play: function () {
                var self = this;
                var m = Math.floor(self.time / 60);
                var s = self.time % 60; 
                self.el.innerHTML = str(padStart(m, 2, 0), ':', padStart(s, 2, 0));
                self.state = 'play';

                self.timerId = setTimeout(function () {
                    if (self.state === 'pause') return;

                    self.time++;
                    self.play();
                }, 1000);
            },
            pause: function () {
                this.state = 'pause';
                if (this.timerId) clearTimeout(this.timerId);
            },
        },

        // operations
        init: function (parent, handler) {            
            var self = this;
            var cnt = self.ITEMS_CNT; 
            var panelWidth = self.WIDTH; //px 
            var panelHeight = cnt * panelWidth; // px

            var panel = createElement('ul');
            panel.classList.add('jigsaw-game-panel');
            panel.style.display = 'none';
            panel.style.width = panelWidth + 'px';
            panel.style.height = panelHeight + 'px';

            var items = [], li, i;
            for (i = 0; i < cnt; i++) {
                li = createElement('li');
                li.style.height = panelWidth + 'px';
                panel.appendChild(li);
                items.push(li);
            }

            var playPauseEl = items[2];
            self.state = 'play';
            self._setIcon(playPauseEl, 'pause');
            playPauseEl.addEventListener('click', function (e) {
                e.stopPropagation();
                if (self.state === 'done') {
                    return;
                }
                else if (self.state === 'play') {
                    self.state = 'pause';
                    self.timer.pause();
                    self._setIcon(playPauseEl, 'play');
                    if (self.handler && self.handler.pause) {
                        self.handler.pause();
                    }
                } else {
                    self.state = 'play';
                    self.timer.play();
                    self._setIcon(playPauseEl, 'pause');
                    if (self.handler && self.handler.play) {
                        self.handler.play(); 
                    }
                }
            }, false);

            var closeEl = items[3];
            self._setIcon(closeEl, 'close');
            closeEl.addEventListener('click', function (e) {
                e.stopPropagation();             
                if (self.handler && self.handler.close) {
                    self.handler.close();
                }
            }, false);

            self.root = panel;
            self.items = items;
            self.handler = handler;
            parent.appendChild(panel);
        },
        open: function (locate, step) {
            this.timer.init(this.items[0]);
            this.timer.play();
            this.updateSteps(step);
            this.state = 'play';
            this._setIcon(this.items[2], 'pause');

            this.root.style.left = locate.left + 'px';
            this.root.style.display = 'block';
        },
        close: function () {               
            this.root.style.display = 'none';
            this.timer.pause();
        },
        done: function () {
            this.timer.pause();
            this.state = 'done';
            this.items[2].style.cursor = 'not-allowed';
        },
        updateSteps: function (step) {
            var stepEl = this.items[1];
            stepEl.innerHTML = str(step.complete, '/', step.total);
        },

        // inner functions
        _setIcon: function (el, icon) {    
            el.setAttribute('title', icon);        
            el.style.backgroundImage = str('url(lib/icon/', icon, '.svg)');
            el.style.backgroundSize = '70%';
            el.style.backgroundPosition = 'center';
            el.style.backgroundRepeat = 'no-repeat';
            el.style.cursor = 'pointer';
        },
    };

    var gamePlayground = {
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
            rotateRatio: 0
        },
        draggableElems: [],
        draggingElem: null,
        totalSteps: 0,
        completeSteps: 0,
        gameFinished: null,

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
                        if (!context.confirm(msg)) {
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
                var locate = { left: panelLeft };
                var step = {
                    total: self.totalSteps,
                    complete: self.completeSteps,
                };
                self.panel.open(locate, step);

                self.gameFinished = function () {
                    self.difficulty = {
                        row: 1,
                        col: 1,
                        rotateRatio: 0,
                    };
                    self._genImgPieces(imgSize);                    
                    self.pause.style.opacity = '0';
                    self.pause.style.display = 'block';
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
            var rotateRatio = self.difficulty.rotateRatio;
            var rotateElemCnt = Math.round(row * col * rotateRatio);
            var scaledSize = self._computeImgDisplaySize(imgW, imgH, maxW, maxH);
            var panelWidth = self.panel.WIDTH;
            var panelGap = (maxW - scaledSize.w)/2;
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
                    wrappers.push(self._genWrapper(position));
                    pieces.push(self._genPiece(position, sw, sh, pw, ph));
                }
            } 

            // random piece position & add piece with wrapper to playground
            var fragment = document.createDocumentFragment(); 
            self.draggableElems = []; 
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
                self.draggableElems.push(w);
                fragment.appendChild(w);
            }); 

            var playground = self.playground;
            playground.style.width = sw + 'px';
            playground.style.height = sh + 'px';
            playground.innerHTML = '';
            playground.appendChild(fragment);

            return scaledSize;
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

            // events 
            var handleDragStart = function (e) {                
                self.draggingElem = this;

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
                if (this !== self.draggingElem) {
                    this.classList.add('drag-over');		
                }
            };
            var handleDragLeave = function (e) {
                this.classList.remove('drag-over');  
            };
            var handleDrop = function (e) {
                e.preventDefault();
                e.stopPropagation(); 
                
                if (this !== self.draggingElem) {
                    self.draggingElem.innerHTML = this.innerHTML;
                    this.innerHTML = e.dataTransfer.getData('text/html');
                    self._judgeProgress(self.draggingElem, this);
                }
            };
            var handleDragEnd = function (e) {
                [].forEach.call(self.draggableElems, function (e) {
                    e.classList.remove('drag-over');
                });
                self.draggingElem.style.opacity = '1';
                self.draggingElem.style.transform = 'none';
                self.draggingElem = null;
            };
            div.addEventListener('dragstart', handleDragStart, false);
            div.addEventListener('dragover', handleDragOver, false);	
            div.addEventListener('dragenter', handleDragEnter, false);
            div.addEventListener('dragleave', handleDragLeave, false);
            div.addEventListener('drop', handleDrop, false);		
            div.addEventListener('dragend', handleDragEnd, false);
            return div;
        },
        _genPiece: function (position, sw, sh, pw, ph) {
            var sx = pw * position.col;
            var sy = ph * position.row;
            var div = createElement('div');
            div.classList.add('piece');        
            div.style.width = str(pw, 'px');
            div.style.height = str(ph,'px');
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

    context.jigsaw = function (el, width, height) {
        // initalize
        el.innerHTML = '';
        el.classList.add('jigsaw');
        el.style.width = width + 'px';
        el.style.height = height + 'px';

        var levels = ['simple', 'middle', 'hard'];
        var levelMap = {
            simple: {
                row: 3,
                col: 3, 
                rotateRatio: 0,
            },
            middle: {
                row: 5,
                col: 5,
                rotateRatio: 0.2,
            },
            hard: {
                row: 6,
                col: 6,
                rotateRatio: 0.7
            }
        };
        var imgUrl = null;
        var size = {
            w: width, 
            h: height
        };

        imgSelector.init(el, function (imgSrc) {
            imgSelector.close();
            levelSelector.open();
            imgUrl = imgSrc;
        });
        levelSelector.init(el, levels, levelMap, function (level) {
            levelSelector.close();
            gamePlayground.serve(imgUrl, level);
        });
        gamePlayground.init(el, size, gamePanel, function () {
            imgSelector.open();
        });

        imgSelector.open();
    };

    // ++++++ util +++++++++   
    function str() {
        return [].slice.call(arguments, 0).join('');
    }

    // get one number form [start, end)
    function random (start, end) {
        var range = end - start - 1;
        return Math.round(Math.random() * range) + start;
    }

    function setDomData(node, key, value) {
        var attrKey = 'data-' + key;
        var attrVal = JSON.stringify(value);
        node.setAttribute(attrKey, attrVal);
    }

    function getDomData(node, key) {
        var attrKey = 'data-' + key;
        var val = node.getAttribute(attrKey);
        return JSON.parse(val);
    }

    function partEqual(keys, objA, objB) {
        var i, key;
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            if (objA[key] !== objB[key]) return false;
        }
        return true;
    }

    function padStart(str, targetLen, padStr) {
        str = str + '';
        var len = str.length;
        targetLen = parseInt(targetLen);
        if (len >= targetLen) return str;
        
        padStr = typeof padStr === 'number' ? padStr : (padStr || ' ');
        var rest = targetLen - len;
        var pad = padStr + '';
        while (pad.length < rest) {
            pad += padStr;
        }
        return pad.slice(0, rest) + str;
    }

})(window);