import { cleanup, fireEvent, render } from '@testing-library/react'
import RadioAndListDialog from '../RadioAndListDialog';

afterEach(cleanup);

describe('RadioAndListDialog', () => {
    test('Display without errors', () => {
        const { queryByTestId } = render(<RadioAndListDialog />);
        const radioAndListDialog = queryByTestId('radioAndListDialog');

        expect(radioAndListDialog).toBeDefined();
    });

    test('Initialize correct items', () => {
        const items = ['item1', 'item2', 'item3'];
        const { getByTestId } = render(<RadioAndListDialog items={items} />);
        const radioAndListDialog = getByTestId('radioAndListDialog');
        const inputs = radioAndListDialog.getElementsByTagName('input');

        //item.length + 1 because there is an empty input created
        expect(inputs.length).toBe(items.length + 1);

        items.forEach((item, idx) => {
            expect(inputs[idx].value).toBe(item);
        });
    });

    test('Add item', () => {
        const { getByTestId } = render(<RadioAndListDialog />);
        const radioAndListDialog = getByTestId('radioAndListDialog');
        const input = getByTestId('radioAndListDialog-Input');
        const addBtn = getByTestId('radioAndListDialog-AddBtn');

        const testValue = 'Any value';
        fireEvent.change(input, { target: { value: testValue } });

        fireEvent.click(addBtn);

        const inputs = radioAndListDialog.getElementsByTagName('input');

        expect(inputs.length).toBe(2);
        expect(inputs[0].value).toBe(testValue);
    });

    test('Remove item', () => {
        const items = ['item1', 'item2', 'item3'];
        const { getByTestId } = render(<RadioAndListDialog items={items} />);
        const radioAndListDialog = getByTestId('radioAndListDialog');
        let inputs = radioAndListDialog.getElementsByTagName('input');

        const idx = Math.round(Math.random() * (items.length - 1));

        //input's next sibling is the remove button
        fireEvent.click(inputs[idx].nextSibling);

        inputs = radioAndListDialog.getElementsByTagName('input');

        expect(inputs.length).toBe(3);

        let isItemExists = false;

        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value === items[idx]) {
                isItemExists = true;
                break;
            }
        }

        expect(isItemExists).toBeFalsy();
    });
});