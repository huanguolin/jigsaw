import imgSelector from '../src/imgSelector';
import * as testUtil from '../testUtil';

describe('imgSelector', () => {
    beforeEach(() => (document.body.innerHTML = `<div id="test"></div>`));

    describe('display status', () => {
        beforeEach(() => {
            imgSelector.init(document.getElementById('test'));
        });

        test('not display when init', () => {
            expect(imgSelector.root.style.display).toBe('none');
        });

        test('show when open', () => {
            imgSelector.open();
            expect(imgSelector.root.style.display).toBe('block');
        });

        test('hide when close', () => {
            imgSelector.open();
            imgSelector.close();
            expect(imgSelector.root.style.display).toBe('none');
        });
    });

    describe('DOM structure', () => {
        beforeEach(() => {
            imgSelector.init(document.getElementById('test'));
        });

        test('init', () => {
            expect(imgSelector.root).toMatchInlineSnapshot(`
                                <div
                                  class="jigsaw-img-selector"
                                  style="display: none;"
                                >
                                  <span>
                                    Drag Picture Here or Click to Select
                                  </span>
                                </div>
                        `);
        });

        test('open', () => {
            imgSelector.open();
            expect(imgSelector.root).toMatchInlineSnapshot(`
                <div
                  class="jigsaw-img-selector"
                  style="display: block;"
                >
                  <span>
                    Drag Picture Here or Click to Select
                  </span>
                  <input
                    accept="image/*"
                    style="display: none;"
                    type="file"
                  />
                </div>
            `);
        });

        test('close', () => {
            imgSelector.open();
            imgSelector.close();
            expect(imgSelector.root).toMatchInlineSnapshot(`
                <div
                  class="jigsaw-img-selector"
                  style="display: none;"
                >
                  <span>
                    Drag Picture Here or Click to Select
                  </span>
                  <input
                    accept="image/*"
                    style="display: none;"
                    type="file"
                  />
                </div>
            `);
        });
    });

    describe('effect', () => {
        beforeEach(() => {
            imgSelector.init(document.getElementById('test'));
            imgSelector.open();
        });

        test('click span should trigger input click', () => {    
            // add test to detect point
            const testCb = jest.fn();
            const elInput = document.querySelector('input[type="file"]');
            elInput.addEventListener('click', testCb);
    
            // mock span click
            imgSelector.root.querySelector('span').dispatchEvent(
                new Event('click', {
                    bubbles: true,
                    cancelable: false,
                })
            );
    
            // expect result
            expect(testCb).toHaveBeenCalledTimes(1);
        });
    
        test('input click event must stop propagation to avoid dead loop', () => {    
            // mock Event.prototype.stopPropagation and add detect flag
            const overriddenStop = Event.prototype.stopPropagation;
            Event.prototype.stopPropagation = function() {
                this.isPropagationStopped = true;
                overriddenStop.apply(this, arguments);
            };
    
            // mock callback
            const testCb = jest.fn(e => e.isPropagationStopped);
            const elInput = document.querySelector('input[type="file"]');
            elInput.addEventListener('click', testCb);
    
            // mock span click
            imgSelector.root.querySelector('span').dispatchEvent(
                new Event('click', {
                    bubbles: true,
                    cancelable: false,
                })
            );
    
            // expect result
            expect(testCb).toHaveReturnedWith(true);
    
            // restore Event.prototype.stopPropagation
            Event.prototype.stopPropagation = overriddenStop;
        });
    
        test('drag-over should set drop-effect to "copy"', () => {    
            // mock callback
            const testCb = jest.fn(e => e.dataTransfer.dropEffect);
            imgSelector.root.addEventListener('dragover', testCb);
    
            // mock drag over event
            const event = new Event('dragover');
            event.dataTransfer = { dropEffect: 'none' };
            imgSelector.root.dispatchEvent(event);
    
            // result
            expect(testCb).toHaveBeenCalledTimes(1);
            expect(testCb).toHaveReturnedWith('copy');
        });
    });

    describe('get file', () => {
        const mockFile = 'mock-file';
        let backup;
        beforeAll(() => {
            // mock window.URL.createObjectURL method
            backup = window.URL.createObjectURL;
            window.URL.createObjectURL = e => e;
        });

        afterAll(() => {
            // restore window.URL.createObjectURL method
            window.URL.createObjectURL = backup;
        });

        let testCb;
        beforeEach(() => {
            // mock callback
            testCb = jest.fn(f => f);
            imgSelector.init(document.getElementById('test'), testCb);
            imgSelector.open();
        });

        test('via click input', () => {
            // mock file select
            const elInput = document.querySelector('input[type="file"]');
            testUtil.setFilesToInput(elInput, [mockFile]);

            // trigger input change event
            elInput.dispatchEvent(new Event('change'));

            // result
            expect(testCb).toHaveBeenCalledTimes(1);
            expect(testCb).toHaveReturnedWith(mockFile);
        });

        test('via drag-drop', () => {
            // trigger drag drop event
            const event = new Event('drop');
            event.dataTransfer = { files: [mockFile] };
            imgSelector.root.dispatchEvent(event);

            // result
            expect(testCb).toHaveBeenCalledTimes(1);
            expect(testCb).toHaveReturnedWith(mockFile);
        });
    });
});
