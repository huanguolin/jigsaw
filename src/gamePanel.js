import { 
    createElement, 
    str, 
    padStart, 
} from './util';

export default {
    // const
    WIDTH: 50,
    ITEMS_CNT: 4,
    // inner attrs
    handler: {
        play: null,
        pause: null,
        close: null,
    },
    root: null,
    items: [],
    state: '',
    timer: {
        el: null,
        time: 0,
        timerId: null,
        state: '',
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
                if (self.state === 'pause')
                    return;
                self.time++;
                self.play();
            }, 1000);
        },
        pause: function () {
            this.state = 'pause';
            if (this.timerId)
                clearTimeout(this.timerId);
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
            }
            else {
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
        var playPauseEl = this.items[2];
        this._setIcon(playPauseEl, 'play');
        playPauseEl.style.cursor = 'not-allowed';
    },
    updateSteps: function (step) {
        var stepEl = this.items[1];
        stepEl.innerHTML = str(step.complete, '/', step.total);
    },
    // inner functions
    _setIcon: function (el, icon) {
        el.setAttribute('title', icon);
        el.style.backgroundImage = str('url(./icon/', icon, '.svg)');
        el.style.backgroundSize = '70%';
        el.style.backgroundPosition = 'center';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.cursor = 'pointer';
    },
};
