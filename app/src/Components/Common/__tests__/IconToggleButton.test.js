import { cleanup, fireEvent, getByText, render } from '@testing-library/react'
import IconToggleButton from '../IconToggleButton'

afterEach(cleanup);

describe('IconToggleButton', () => {
    test('Initialize toggle state correctly', () => {
        const { getByTestId } = render(<IconToggleButton />);
        const iconToggleBtn = getByTestId('iconToggleBtn');

        expect(iconToggleBtn).toHaveClass('off');

        cleanup();

        render(<IconToggleButton toggleState='on' />);
        const iconToggleBtnOn = getByTestId('iconToggleBtn');

        expect(iconToggleBtnOn).toHaveClass('on');
    });

    test('Toggle On/Off', () => {
        const { getByTestId } = render(<IconToggleButton />);
        const iconToggleBtn = getByTestId('iconToggleBtn');

        expect(iconToggleBtn).toHaveClass('off');

        fireEvent.click(iconToggleBtn);
        
        expect(iconToggleBtn).toHaveClass('on');
        expect(iconToggleBtn).not.toHaveClass('off');

        fireEvent.click(iconToggleBtn);
        
        expect(iconToggleBtn).toHaveClass('off');
        expect(iconToggleBtn).not.toHaveClass('on');
    });

    test('OnClick callback', () => {
        let clicked = false;
        const { getByTestId } = render(<IconToggleButton onClick={() => { clicked = true; }} />);
        const iconToggleBtn = getByTestId('iconToggleBtn');

        fireEvent.click(iconToggleBtn);

        expect(clicked).toBeTruthy();
    });
});