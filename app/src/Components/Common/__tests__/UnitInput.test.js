import { cleanup, fireEvent, render } from '@testing-library/react';
import UnitInput, { unitArr, defaultUnit } from '../UnitInput';

afterEach(cleanup);

describe('UnitInput', () => {
    test('Show correct default unit', () => {
        const randomValue = (Math.random() * 999).toFixed(2);

        const { getByTestId } = render(<UnitInput selectedValue={randomValue} />);
        const unitInput = getByTestId('unitInput');

        fireEvent.blur(unitInput);

        expect(unitInput).toHaveValue(`${randomValue}${defaultUnit}`);
    });

    test('Value that ends with zeroes to have correct unit', () => {
        const { getByTestId } = render(<UnitInput selectedValue='' />);
        const unitInput = getByTestId('unitInput');

        const number = '1234.45000'
        const unit = unitArr[Math.round(Math.random() * (unitArr.length - 1))];
        const value = `${number}${unit}`;
        fireEvent.change(unitInput, { target: { value } });
        fireEvent.blur(unitInput);

        expect(unitInput).toHaveValue(`${Number.parseFloat(value)}${unit}`);
    });

    test('Show other units from the unit array', () => {
        const { getByTestId } = render(<UnitInput selectedValue='' />);
        const unitInput = getByTestId('unitInput');

        unitArr.forEach(unit => {
            const value = `${Number.parseFloat((Math.random() * 999).toFixed(2))}${unit}`;
            fireEvent.change(unitInput, { target: { value } });
            fireEvent.blur(unitInput);

            expect(unitInput).toHaveValue(value);
        });
    });

    test('Undefined value', () => {
        const { getByTestId } = render(<UnitInput selectedValue={undefined} />);
        const unitInput = getByTestId('unitInput');

        expect(unitInput).toHaveValue('');
    });

    test('OnBlur callback', () => {
        let testValue = '';
        const { getByTestId } = render(<UnitInput selectedValue={testValue} onBlur={value => testValue = value} />);
        const unitInput = getByTestId('unitInput');

        const value = Number.parseFloat('12345.6000');
        fireEvent.blur(unitInput, { target: { value } });

        expect(testValue).toBe(`${value}${defaultUnit}`);
    });
});