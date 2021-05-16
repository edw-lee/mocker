import { cleanup, fireEvent, render } from '@testing-library/react'
import BorderWidthSelector, { BORDER_WIDTH_ARR } from '../BorderWidthSelector'

afterEach(cleanup);

describe('BorderWidthSelector', () => {
    //Initialize width array
    const widthArr = ['Default', ...BORDER_WIDTH_ARR];

    test('Display correct values', () => {
        const { getByTestId } = render(<BorderWidthSelector selectedWidth='' />);
        const borderWidthSelector = getByTestId('borderWidthSelector');
        const options = borderWidthSelector.children;

        expect(options.length).toEqual(widthArr.length);

        widthArr.forEach((width, idx) => {
            expect(options[idx]).toHaveTextContent(width);
        })
    });

    widthArr.forEach(width => {
        if (width === 'Default') width = '';

        test('Select correct initial width', () => {
            const { getByTestId } = render(<BorderWidthSelector selectedWidth={width} />);
            /**@type{HTMLSelectElement} */
            const borderWidthSelector = getByTestId('borderWidthSelector');

            expect(borderWidthSelector.value).toBe(width);
        });
    });

    test('Invalid initial selected width', () => {
        const { getByTestId } = render(<BorderWidthSelector selectedWidth='Any value that is not in the width array' />);
        /**@type{HTMLSelectElement} */
        const borderWidthSelector = getByTestId('borderWidthSelector');

        expect(borderWidthSelector.value).toBe('undefined');
    });

    test('Select valid width', () => {
        const { getByTestId } = render(<BorderWidthSelector />);
        /**@type{HTMLSelectElement} */
        const borderWidthSelector = getByTestId('borderWidthSelector');

        let idx = Math.round(Math.random() * (widthArr.length - 1));
        let value = idx > 0 ? widthArr[idx] : '';
        fireEvent.select(borderWidthSelector, { target: { value } });

        expect(borderWidthSelector.value).toBe(value);
    });

    test('Select invalid width', () => {
        const { getByTestId } = render(<BorderWidthSelector />);
        /**@type{HTMLSelectElement} */
        const borderWidthSelector = getByTestId('borderWidthSelector');

        fireEvent.select(borderWidthSelector, { target: { value: 'Any value that is not in the width array' } });

        //Default value
        expect(borderWidthSelector.value).toBe('');
    });

    test('OnChange callback', () => {
        let changed = false;
        const { getByTestId } = render(<BorderWidthSelector onChange={() => { changed = true; }} />);

        /**@type{HTMLSelectElement} */
        const borderWidthSelector = getByTestId('borderWidthSelector');

        fireEvent.change(borderWidthSelector);

        expect(changed).toBeTruthy();
    });
});