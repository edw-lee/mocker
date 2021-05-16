import { cleanup, fireEvent, render } from '@testing-library/react';
import UndefinedSelector from '../UndefinedSelector';

afterEach(cleanup);

describe('UndefinedSelector', () => {
    const TEST_ID = 'undefinedSelector';
    const TEST_OPTIONS = ['Option1', 'Option2', 'Option3']

    test('Display correctly', () => {
        const testClassName = 'AnyClass';
        const testChildren = TEST_OPTIONS.map(option => <option key={option}>{option}</option>)
        const { getByTestId } = render(<UndefinedSelector testId={TEST_ID} className={testClassName} selectedValue='' children={testChildren} />);
        const undefinedSelector = getByTestId(TEST_ID);
        const options = undefinedSelector.children;

        expect(options.length).toBe(testChildren.length + 1);
        expect(undefinedSelector).toHaveClass(testClassName);
        expect(undefinedSelector.value).toBe('');
    });

    test('Undefined value', () => {
        const { getByTestId } = render(<UndefinedSelector testId={TEST_ID} selectedValue={undefined} />);
        const undefinedSelector = getByTestId(TEST_ID);

        expect(undefinedSelector.value).toBe('undefined');
    });

    test('OnChange callback', () => {
        let changed = false;
        const { getByTestId } = render(<UndefinedSelector testId={TEST_ID} onChange={() => changed = true} />);
        const undefinedSelector = getByTestId(TEST_ID)

        fireEvent.change(undefinedSelector);
        
        expect(changed).toBeTruthy();
    });
});