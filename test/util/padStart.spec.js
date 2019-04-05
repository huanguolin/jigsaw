import { padStart } from '../../src/util/padStart';

test('padStart', () => {
    const cases = [
        [['123', 2], '123'],
        [['123', 3], '123'],
        [['123', 4], ' 123'],
        [['123', 4, '0'], '0123'],
    ];
    cases.forEach(([input, output]) => {
        expect(padStart(...input)).toBe(output);
    });
});