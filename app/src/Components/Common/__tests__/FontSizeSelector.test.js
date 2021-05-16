import { cleanup, fireEvent, render } from '@testing-library/react';
import FontSizeSelector, { fontSizeVals } from '../FontSizeSelector';

afterEach(cleanup);

describe('FontSizeSelector', () => {
    test('Display correct initial value', () => {
        const { getByTestId } = render(<FontSizeSelector selectedFontSize='' />);
        const fontSizeSelector = getByTestId('fontSizeSelector');
        const options = fontSizeSelector.children;

        expect(options[0]).toHaveTextContent('Default');

        fontSizeVals.forEach((size, idx) => {
            expect(options[idx + 1]).toHaveTextContent(`${size} pt`);
        });
    });

    test('Select correct initial font size', () => {
        fontSizeVals.forEach(size => {
            const fontSize = `${size}px`;
            const { getByTestId } = render(<FontSizeSelector selectedFontSize={fontSize} />);
            const fontSizeSelector = getByTestId('fontSizeSelector');

            expect(fontSizeSelector.value).toBe(fontSize);

            cleanup();
        })
    });

    test('Undefined font size', () => {
        const { getByTestId } = render(<FontSizeSelector />);
        const fontSizeSelector = getByTestId('fontSizeSelector');

        expect(fontSizeSelector.value).toBe('undefined');
    });

    test('OnChange callback', () => {
        let testFontSize = '';
        const { getByTestId } = render(<FontSizeSelector selectedFontSize={testFontSize} onChange={e => { testFontSize = e.target.value; }} />);
        const fontSizeSelector = getByTestId('fontSizeSelector');

        const idx=Math.round(Math.random() * (fontSizeVals.length - 1));
        const selectedFontSize = `${fontSizeVals[idx]}px`;
        fireEvent.change(fontSizeSelector, {target:{value: selectedFontSize}});

        expect(testFontSize).toBe(selectedFontSize);
    });
});