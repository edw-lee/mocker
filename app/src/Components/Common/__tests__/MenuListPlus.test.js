import { fireEvent, render } from '@testing-library/react';
import MenuListPlus from '../MenuListPlus';

describe('MenuListPlus', () => {
    test('Correct assigned class', () => {
        const className = 'AnyClass';
        const { getByTestId } = render(<MenuListPlus className={className} />);
        const menuListPlus = getByTestId('menuListPlus');

        expect(menuListPlus).toHaveClass(className);
    });

    test('AddFunction callback', () => {
        let added = false;

        const { getByTestId } = render(<MenuListPlus addFunction={() => { added = true; }} />);
        const menuListPlusBtn = getByTestId('menuListPlusBtn');

        fireEvent.click(menuListPlusBtn);

        expect(added).toBeTruthy();
    });
});