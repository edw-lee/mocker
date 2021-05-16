import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import ColorPicker from '../ColorPicker'

afterEach(cleanup);

describe('ColorPicker', () => {
    test('Default color value', () => {
        const { getByTestId } = render(<ColorPicker />);
        const colorPickerInput = getByTestId('colorPickerInput');

        expect(colorPickerInput.value).toBe('#000000');
    });

    test('Initialize color value', () => {
        //Any random color hex code will do
        const { getByTestId } = render(<ColorPicker value='#ab12c3' />);
        const colorPickerInput = getByTestId('colorPickerInput');

        expect(colorPickerInput.value).toBe('#ab12c3');
    });

    test('Clear color', () => {
        //Any random color hex code will do
        const { getByTestId } = render(<ColorPicker value='#bc45ef' />);
        const colorPickerInput = getByTestId('colorPickerInput');
        const colorPickerClearBtn = getByTestId('colorPickerClearBtn');

        fireEvent.click(colorPickerClearBtn);

        expect(colorPickerInput.value).toBe('#000000');
    });

    test('OnChange callback', () => {
        let output = '';
        const { getByTestId } = render(<ColorPicker value='#fe54e3' onChange={value => { output = value }} />);
        const colorPickerInput = getByTestId('colorPickerInput');

        const value = '#abfe45';
        fireEvent.change(colorPickerInput, { target: { value } });

        expect(output).toBe(value)
    });
});