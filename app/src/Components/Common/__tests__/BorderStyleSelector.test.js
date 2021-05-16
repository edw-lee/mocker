import { cleanup, fireEvent, render } from '@testing-library/react'
import '../BorderStyleSelector'
import BorderStyleSelector, { borderStyleArr } from '../BorderStyleSelector';

afterEach(cleanup)

describe("BorderStyleSelector", () => {
    borderStyleArr.forEach(borderStyle => {
        test(`Initialize with selected '${borderStyle}' border correctly`, () => {
            const { getByTestId } = render(<BorderStyleSelector selectedBorderStyle={borderStyle} />);
            const borderStyleOption = getByTestId(`borderStyleOption-${borderStyle}`);
            expect(borderStyleOption).toHaveClass('selected');
        })
    });

    test('Toggle border style', () => {
        const { getByTestId } = render(<BorderStyleSelector selectedBorderStyle='' />);
        const borderStyleOptBtn = getByTestId('borderStyleOptBtn');
        const borderStyleOptions = getByTestId('borderStyleOptions');

        fireEvent.click(borderStyleOptBtn);

        expect(borderStyleOptions).toHaveStyle({ opacity: 1, display: 'block' });

        fireEvent.click(borderStyleOptBtn);

        expect(borderStyleOptions).toHaveStyle({ opacity: 0, display: 'none' });
    });

    test('Undefined border style', () => {
        const { getByTestId } = render(<BorderStyleSelector selectedBorderStyle='Any value that is not in the border style array' />);
        const borderStyleUndefined = getByTestId('borderStyleOption-undefined');
        expect(borderStyleUndefined).toBeDefined();
    });

    test('Hover border style', () => {
        const { getByTestId } = render(<BorderStyleSelector selectedBorderStyle='' />);
        const borderStyleOptBtn = getByTestId('borderStyleOptBtn');

        fireEvent.click(borderStyleOptBtn);

        borderStyleArr.forEach(borderStyle => {
            const borderStyleOption = getByTestId(`borderStyleOption-${borderStyle}`);

            fireEvent.mouseOver(borderStyleOption);

            expect(borderStyleOption).toHaveClass('selected');
        });
    });

    test('Select border style', () => {
        const { getByTestId } = render(<BorderStyleSelector selectedBorderStyle='' />);

        const borderStyleOptBtn = getByTestId('borderStyleOptBtn');

        fireEvent.click(borderStyleOptBtn);

        borderStyleArr.forEach(borderStyle => {
            const borderStyleOption = getByTestId(`borderStyleOption-${borderStyle}`);

            fireEvent.click(borderStyleOption);

            const borderStyleOptBtn = getByTestId('borderStyleOptBtn');
            const borderStyleOptions = getByTestId('borderStyleOptions');

            expect(borderStyleOptBtn.firstChild).toHaveStyle({ borderStyle });
            expect(borderStyleOptions).toHaveStyle({ opacity: 0, display: 'none' });
        });
    });

    test('Click window after selector is shown', () => {
        const { getByTestId } = render(<BorderStyleSelector selectedBorderStyle='' />);

        const borderStyleOptBtn = getByTestId('borderStyleOptBtn');
        const borderStyleOptions = getByTestId('borderStyleOptions');

        fireEvent.click(borderStyleOptBtn);

        expect(borderStyleOptions).toHaveStyle({ opacity: 1, display: 'block' });

        fireEvent.click(window);

        expect(borderStyleOptions).toHaveStyle({ opacity: 0, display: 'none' });
    });

    test('OnBorderStyleChange callback', () => {
        let changed = false;
        const { getByTestId } = render(<BorderStyleSelector onBorderStyleChanged={() => { changed = true }} />);

        const idx = Math.round(Math.random() * (borderStyleArr.length - 1));
        const borderStyle = borderStyleArr[idx];
        const borderStyleOption = getByTestId(`borderStyleOption-${borderStyle}`);

        fireEvent.click(borderStyleOption);

        expect(changed).toBeTruthy();
    });
});