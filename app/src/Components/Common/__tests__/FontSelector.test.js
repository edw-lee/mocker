import fontFamilies from '../../../Constants/font_families.json';
import { cleanup, fireEvent, render } from '@testing-library/react';
import FontSelector from '../FontSelector';

afterEach(cleanup);

describe('FontSelector', () => {
    test('Display font families correctly', () => {
        const { getByTestId } = render(<FontSelector selectedFontFamily='' />);
        const fontSelector = getByTestId('fontSelector');
        const options = fontSelector.children;

        expect(options[0]).toHaveTextContent('Default');

        Object.keys(fontFamilies).forEach((fontFamily, idx) => {
            //Note: idx+2 because idx = 0 belongs to the the Default option
            expect(options[idx + 1]).toHaveTextContent(fontFamily);
        });
    });

    test('Select initial font family correctly', () => {
        Object.keys(fontFamilies).forEach(key => {
            const { getByTestId } = render(<FontSelector selectedFontFamily={fontFamilies[key]} />);
            const fontSelector = getByTestId('fontSelector');

            expect(fontSelector.value).toBe(fontFamilies[key]);

            cleanup();
        });
    });

    test('Undefined font family', () => {
        const { getByTestId } = render(<FontSelector />);
        const fontSelector = getByTestId('fontSelector');

        expect(fontSelector.value).toBe('undefined');
    });

    test('Selector class', () => {
        const className = 'AnyClass';
        const { getByTestId } = render(<FontSelector className={className}/>);
        const fontSelector = getByTestId('fontSelector');

        expect(fontSelector).toHaveClass(className);
    });

    test('OnChange callback', () => {
        let testFontFamily = '';
        const { getByTestId } = render(<FontSelector selectedFontFamily={testFontFamily} onChange={e => { testFontFamily = e.target.value }} />);
        /**@type{HTMLSelectElement} */
        const fontSelector = getByTestId('fontSelector');
        const options = fontSelector.children;

        const idx = Math.round(Math.random() * (options.length - 1));
        fireEvent.change(fontSelector, { target: { value: options[idx].value } });

        expect(testFontFamily).toBe(options[idx].value);
    });
});