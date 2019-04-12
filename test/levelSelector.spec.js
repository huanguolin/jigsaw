import LevelSelector from '../src/levelSelector';

const levelSelector = new LevelSelector();

describe('levelSelector', () => {
    var levels = ['simple', 'hard', 'custom'];
    var levelMap = {
        simple: {
            row: 2,
            col: 2,
        },
        hard: {
            row: 10,
            col: 10,
        },
    };
    beforeEach(() => (document.body.innerHTML = `<div id="test"></div>`));

    describe('DOM structure', () => {
        beforeEach(() => {
            levelSelector.init(
                document.getElementById('test'),
                levels,
                levelMap
            );
        });

        test('init', () => {
            expect(levelSelector.root).toMatchInlineSnapshot(`
                                <div
                                  class="jigsaw-level-selector"
                                  style="display: none;"
                                >
                                  <h2>
                                    Select the Level of Difficulty
                                  </h2>
                                  <ul>
                                    <li>
                                      simple
                                    </li>
                                    <li>
                                      hard
                                    </li>
                                    <li>
                                      custom
                                    </li>
                                  </ul>
                                  <ul
                                    class="custom-input"
                                  >
                                    <li>
                                      <span>
                                        Row
                                      </span>
                                      <input
                                        max="10"
                                        min="2"
                                        type="number"
                                        value="4"
                                      />
                                    </li>
                                    <li>
                                      <span>
                                        Column
                                      </span>
                                      <input
                                        max="10"
                                        min="2"
                                        type="number"
                                        value="4"
                                      />
                                    </li>
                                    <li>
                                      <button>
                                        OK
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                        `);
        });

        test('open', () => {
            levelSelector.open();
            expect(levelSelector.root).toMatchInlineSnapshot(`
                                <div
                                  class="jigsaw-level-selector"
                                  style="display: block;"
                                >
                                  <h2>
                                    Select the Level of Difficulty
                                  </h2>
                                  <ul>
                                    <li>
                                      simple
                                    </li>
                                    <li>
                                      hard
                                    </li>
                                    <li>
                                      custom
                                    </li>
                                  </ul>
                                  <ul
                                    class="custom-input"
                                    style="display: none;"
                                  >
                                    <li>
                                      <span>
                                        Row
                                      </span>
                                      <input
                                        max="10"
                                        min="2"
                                        type="number"
                                        value="4"
                                      />
                                    </li>
                                    <li>
                                      <span>
                                        Column
                                      </span>
                                      <input
                                        max="10"
                                        min="2"
                                        type="number"
                                        value="4"
                                      />
                                    </li>
                                    <li>
                                      <button>
                                        OK
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                        `);
        });

        test('close', () => {
            levelSelector.open();
            levelSelector.close();
            expect(levelSelector.root).toMatchInlineSnapshot(`
                                <div
                                  class="jigsaw-level-selector"
                                  style="display: none;"
                                >
                                  <h2>
                                    Select the Level of Difficulty
                                  </h2>
                                  <ul>
                                    <li>
                                      simple
                                    </li>
                                    <li>
                                      hard
                                    </li>
                                    <li>
                                      custom
                                    </li>
                                  </ul>
                                  <ul
                                    class="custom-input"
                                    style="display: none;"
                                  >
                                    <li>
                                      <span>
                                        Row
                                      </span>
                                      <input
                                        max="10"
                                        min="2"
                                        type="number"
                                        value="4"
                                      />
                                    </li>
                                    <li>
                                      <span>
                                        Column
                                      </span>
                                      <input
                                        max="10"
                                        min="2"
                                        type="number"
                                        value="4"
                                      />
                                    </li>
                                    <li>
                                      <button>
                                        OK
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                        `);
        });

        test('click custom and show input', () => {
            levelSelector.open();
            const lis = document.querySelectorAll('h2 + ul > li');
            const customLi = Array.from(lis).find(
                e => e.innerHTML === 'custom'
            );
            customLi.dispatchEvent(new Event('click'));
            expect(levelSelector.root).toMatchInlineSnapshot(`
                <div
                  class="jigsaw-level-selector"
                  style="display: block;"
                >
                  <h2>
                    Select the Level of Difficulty
                  </h2>
                  <ul>
                    <li>
                      simple
                    </li>
                    <li>
                      hard
                    </li>
                    <li>
                      custom
                    </li>
                  </ul>
                  <ul
                    class="custom-input"
                    style="display: block;"
                  >
                    <li>
                      <span>
                        Row
                      </span>
                      <input
                        max="10"
                        min="2"
                        type="number"
                        value="4"
                      />
                    </li>
                    <li>
                      <span>
                        Column
                      </span>
                      <input
                        max="10"
                        min="2"
                        type="number"
                        value="4"
                      />
                    </li>
                    <li>
                      <button>
                        OK
                      </button>
                    </li>
                  </ul>
                </div>
            `);
        });
    });

    describe('get level', () => {
        let mockCb;
        beforeEach(() => {
            mockCb = jest.fn();
            levelSelector.init(
                document.getElementById('test'),
                levels,
                levelMap,
                mockCb
            );
            levelSelector.open();
        });

        test('get simple level', () => {
            const lis = document.querySelectorAll('h2 + ul > li');
            const simpleLi = Array.from(lis).find(
                e => e.innerHTML === 'simple'
            );
            simpleLi.dispatchEvent(new Event('click'));
            expect(mockCb).toHaveBeenCalledTimes(1);
            expect(mockCb).toHaveBeenCalledWith(levelMap.simple);
        });

        test('get default custom level', () => {
            const customOk = document.querySelector('button');
            customOk.dispatchEvent(new Event('click'));
            expect(mockCb).toHaveBeenCalledTimes(1);
            expect(mockCb).toHaveBeenCalledWith({
                row: '4',
                col: '4',
            });
        });        

        test('input { row: 3, col: 8 } and get same level', () => {
            const inputs = document.querySelectorAll('input[type="number"]');
            inputs[0].setAttribute('value', 3);
            inputs[1].setAttribute('value', 8);
            const customOk = document.querySelector('button');
            customOk.dispatchEvent(new Event('click'));
            expect(mockCb).toHaveBeenCalledTimes(1);
            expect(mockCb).toHaveBeenCalledWith({
                row: '3',
                col: '8',
            });
        });
    });
});
