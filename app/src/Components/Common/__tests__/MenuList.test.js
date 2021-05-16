import { render } from '@testing-library/react';
import MenuList from '../MenuList';

describe('MenuList', () => {
    test('Correct assigned class', () => {
        const className = 'AnyClass';
        const {getByTestId} = render(<MenuList className={className}/>);
        const menuList = getByTestId('menuList');

        expect(menuList).toHaveClass(className);
    });
});