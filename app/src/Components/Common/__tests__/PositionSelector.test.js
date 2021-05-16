import { cleanup, fireEvent, render } from '@testing-library/react';
import PositionSelector, { positions } from '../PositionSelector';

afterEach(cleanup);

describe('PositionSelector', () => {
    test('Display correct initial values', () => {
        const { getByTestId } = render(<PositionSelector selectedValue='' />);
        const positionSelector = getByTestId('positionSelector');
        const options = positionSelector.children;

        expect(options[0]).toHaveTextContent('Default');

        positions.forEach((pos, idx) => {
            expect(options[idx + 1]).toHaveTextContent(pos);
        });
    });

    test('Select correct initial values', () => {
        positions.forEach(pos => {
            const { getByTestId } = render(<PositionSelector selectedValue={pos} />);
            const positionSelector = getByTestId('positionSelector');

            expect(positionSelector.value).toBe(pos);

            cleanup();
        });
    });

    test('Undefined value', () => {
        const { getByTestId } = render(<PositionSelector />);
        const positionSelector = getByTestId('positionSelector');

        expect(positionSelector.value).toBe('undefined');
    });

    test('Correct assigned class', () => {
        const className = 'AnyClass';
        const { getByTestId } = render(<PositionSelector className={className} />);
        const positionSelector = getByTestId('positionSelector');

        expect(positionSelector).toHaveClass(className);
    });

    test('OnChange callback', () => {
        let testPosition = '';
        const { getByTestId } = render(<PositionSelector selectedValue={testPosition} onChange={e => testPosition = e.target.value} />);
        const positionSelector = getByTestId('positionSelector');

        const idx = Math.round(Math.random() * (positions.length - 1));
        const value = positions[idx];
        fireEvent.change(positionSelector, { target: { value } });

        expect(testPosition).toBe(value);
    });
});