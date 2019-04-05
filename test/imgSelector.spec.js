import imgSelector from '../src/imgSelector';
import * as testUtil from '../testUtil';


beforeEach(() => {
    document.body.innerHTML = `<div id="test"></div>`;
});

test('imgSelector display status', () => {
    imgSelector.init(document.getElementById('test'));
    expect(imgSelector.root.style.display).toBe('none');
    imgSelector.open();
    expect(imgSelector.root.style.display).toBe('block');
    imgSelector.close();
    expect(imgSelector.root.style.display).toBe('none');
});

test('imgSelector DOM structure', () => {
    imgSelector.init(document.getElementById('test'));
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

test('imgSelector click span should trigger input click', () => {
    imgSelector.init(document.getElementById('test'));
    imgSelector.open();
    
    // add test to detect point 
    const testCb = jest.fn();
    const elInput = document.querySelector('input[type="file"]');
    elInput.addEventListener('click', testCb);

    // mock span click
    imgSelector.root.querySelector('span')
        .dispatchEvent(new Event('click', {
            'bubbles': true,
            'cancelable': false,
        }));

    // expect result 
    expect(testCb).toHaveBeenCalledTimes(1);
});

test('imgSelector input click event must stop propagation to avoid dead loop', () => {
    imgSelector.init(document.getElementById('test'));
    imgSelector.open();

    // mock Event.prototype.stopPropagation and add detect flag
    const overriddenStop = Event.prototype.stopPropagation;
    Event.prototype.stopPropagation = function(){
        this.isPropagationStopped = true;
        overriddenStop.apply(this, arguments);
    }
    
    // add test to detect point 
    const testCb = jest.fn(e => e.isPropagationStopped);
    const elInput = document.querySelector('input[type="file"]');
    elInput.addEventListener('click', testCb);

    // mock span click
    imgSelector.root.querySelector('span')
        .dispatchEvent(new Event('click', {
            'bubbles': true,
            'cancelable': false,
        }));

    // expect result 
    expect(testCb).toHaveReturnedWith(true);
    
    // restore Event.prototype.stopPropagation
    Event.prototype.stopPropagation = overriddenStop;
});

test('imgSelector get file via click input', () => {
    const mockFile = 'mock-file';

    imgSelector.init(document.getElementById('test'), function (file) {
        // test result 
        expect(file).toBe(mockFile);
    });
    imgSelector.open();

    // mock file select
    const elInput = document.querySelector('input[type="file"]');
    testUtil.setFilesToInput(elInput, [mockFile]);
    
    // mock window.URL.createObjectURL method
    const backup = window.URL.createObjectURL;
    window.URL.createObjectURL = e => e;

    // trigger input change event
    elInput.dispatchEvent(new Event('change', {
        'bubbles': true,
        'cancelable': false,
    }));

    // restore window.URL.createObjectURL method
    window.URL.createObjectURL = backup;
});

test('imgSelector get file via drag-drop', () => {
    imgSelector.init(document.getElementById('test'));
    // TODO
});