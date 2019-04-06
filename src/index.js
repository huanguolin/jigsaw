/*!
 * jigsaw
 *
 * (c) 2019 Alvin Huang
 * Released under the MIT License.
 */

import ImgSelector from './ImgSelector';

import levelSelector from './levelSelector';
import gamePanel from './gamePanel';
import gamePlayground from './gamePlayground';

export default function jigsaw(el, width, height) {
    // initalize
    el.innerHTML = '';
    el.classList.add('jigsaw');
    el.style.width = width + 'px';
    el.style.height = height + 'px';

    var levels = ['simple', 'middle', 'hard', 'custom'];
    var levelMap = {
        simple: {
            row: 3,
            col: 3,
        },
        middle: {
            row: 5,
            col: 5,
        },
        hard: {
            row: 7,
            col: 7,
        }
    };
    var imgUrl = null;
    var size = {
        w: width,
        h: height
    };

    const imgSelector = new ImgSelector(el, function (imgSrc) {
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