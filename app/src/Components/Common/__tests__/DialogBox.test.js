import { cleanup, fireEvent, render } from '@testing-library/react'
import DialogBox from '../DialogBox'

afterEach(cleanup);

describe('DialogBox', () => {
    test('Render without props', () => {
        const { getByTestId, queryByTestId } = render(<DialogBox />);
        const dialogBox = getByTestId('dialogBox');
        const dialogBoxTitle = getByTestId('dialogBox-Title');
        const dialogBoxMsg = getByTestId('dialogBox-Msg');
        const dialogBoxOkBtn = queryByTestId('dialogBox-OkBtn');
        const dialogBoxCancelBtn = queryByTestId('dialogBox-CancelBtn');

        expect(dialogBox).toBeDefined();
        expect(dialogBoxTitle).toHaveTextContent('');
        expect(dialogBoxMsg).toHaveTextContent('(No message provided.)');
        expect(dialogBoxOkBtn).toBeNull();
        expect(dialogBoxCancelBtn).toBeNull();
    });

    test('No title', () => {
        const { queryByTestId } = render(<DialogBox />);
        const dialogBoxTitle = queryByTestId('dialogBox-Title');

        expect(dialogBoxTitle).toBeDefined();
    });

    test('Add title', () => {
        const testTitle = 'Any Title';
        const { getByTestId } = render(<DialogBox title={testTitle} />);
        const dialogBoxTitle = getByTestId('dialogBox-Title');

        expect(dialogBoxTitle).toHaveTextContent(testTitle);
    });

    test('Check message', () => {
        const testMsg = 'Any message';
        const { getByTestId } = render(<DialogBox msg={testMsg} />);
        const dialogBoxMsg = getByTestId('dialogBox-Msg');

        expect(dialogBoxMsg).toHaveTextContent(testMsg);
    });

    test('ShowOk and OkText props', () => {
        const testOkText = 'Any Text';
        const { queryByTestId } = render(<DialogBox okText={testOkText} showOk={true} />);
        let dialogBoxOkBtn = queryByTestId('dialogBox-OkBtn');

        expect(dialogBoxOkBtn).not.toBeNull();

        if (dialogBoxOkBtn)
            expect(dialogBoxOkBtn).toHaveTextContent(testOkText);

        cleanup();

        render(<DialogBox okText={testOkText} showOk={false} />);
        dialogBoxOkBtn = queryByTestId('dialogBox-OkBtn')

        expect(dialogBoxOkBtn).toBeNull();
    });

    test('ShowCancel and CancelText props', () => {
        const testCancelText = 'Any Text';
        const { queryByTestId } = render(<DialogBox cancelText={testCancelText} showCancel={true} />);
        let dialogBoxCancelBtn = queryByTestId('dialogBox-CancelBtn');

        expect(dialogBoxCancelBtn).not.toBeNull();

        if (dialogBoxCancelBtn)
            expect(dialogBoxCancelBtn).toHaveTextContent(testCancelText);

        cleanup();

        render(<DialogBox cancelText={testCancelText} showCancel={false} />);
        dialogBoxCancelBtn = queryByTestId('dialogBox-CancelBtn')

        expect(dialogBoxCancelBtn).toBeNull();
    });

    test('Ok function callback', () => {
        let ok = false;
        const { getByTestId } = render(<DialogBox showOk={true} okFunction={() => { ok = true; }} />);
        const dialogBoxOkBtn = getByTestId('dialogBox-OkBtn');

        fireEvent.click(dialogBoxOkBtn);

        expect(ok).toBeTruthy();
    });

    test('Cancel function callback', () => {
        let cancel = false;
        const { getByTestId } = render(<DialogBox showCancel={true} cancelFunction={() => { cancel = true; }} />);
        const dialogBoxCancelBtn = getByTestId('dialogBox-CancelBtn');

        fireEvent.click(dialogBoxCancelBtn);

        expect(cancel).toBeTruthy();
    });

    test('Enter keypress', () => {
        let ok = false;
        const { getByTestId } = render(<DialogBox showOk={true} okFunction={() => { ok = true; }} />);
        let dialogBoxOverlay = getByTestId('dialogBox-Overlay');

        fireEvent.keyUp(dialogBoxOverlay, { key: 'Enter', code: 'Enter' });

        expect(ok).toBeTruthy();
    });

    test('Escape keypress', () => {
        let cancel = false;
        const { getByTestId } = render(<DialogBox cancelFunction={() => { cancel = true; }} />);
        let dialogBoxOverlay = getByTestId('dialogBox-Overlay');

        fireEvent.keyUp(dialogBoxOverlay, { key: 'Escape', code: 'Escape' });

        expect(cancel).toBeTruthy();
    });

    test('Close button', () => {
        let cancel = false;
        const { getByTestId } = render(<DialogBox cancelFunction={() => { cancel = true; }} />);
        let dialogBoxcloseBtn = getByTestId('dialogBox-CloseBtn');

        fireEvent.click(dialogBoxcloseBtn);

        expect(cancel).toBeTruthy();
    });

    test('Class props', () => {
        const boxClass = 'AnyBoxClass';
        const titleClass = 'AnyTitleClass';
        const msgClass = 'AnyMsgClass';
        const btnGrpClass = 'AnyBtnGrpClass';
        const okBtnClass = 'AnyOkBtnClass';
        const cancelBtnClass = 'AnyCancelBtnClass';

        const { getByTestId } = render(<DialogBox showOk={true} showCancel={true} title='Any Title' msg='Any message.' boxClass={boxClass}
            titleclass={titleClass} msgClass={msgClass} btnGrpClass={btnGrpClass} okBtnClass={okBtnClass} cancelBtnClass={cancelBtnClass} />);

        const dialogBox = getByTestId('dialogBox');
        const dialogBoxTitle = getByTestId('dialogBox-Title');
        const dialogBoxMsg = getByTestId('dialogBox-Msg');
        const dialogBoxBtnGrp = getByTestId('dialogBox-BtnGrp');
        const dialogBoxOkBtn = getByTestId('dialogBox-OkBtn');
        const dialogBoxCancelBtn = getByTestId('dialogBox-CancelBtn');

        expect(dialogBox).toHaveClass(boxClass);
        expect(dialogBoxTitle).toHaveClass(titleClass);
        expect(dialogBoxMsg).toHaveClass(msgClass);
        expect(dialogBoxBtnGrp).toHaveClass(btnGrpClass);
        expect(dialogBoxOkBtn).toHaveClass(okBtnClass);
        expect(dialogBoxCancelBtn).toHaveClass(cancelBtnClass);
    });

    test('Mouse drag dialog box', () => {
        const { getByTestId } = render(<DialogBox />);
        const dialogBox = getByTestId('dialogBox');
        const dialogBoxTitle = getByTestId('dialogBox-Title');

        const startLeft = parseInt(dialogBox.style.left);
        const startTop = parseInt(dialogBox.style.top);

        const mouseDownX = Math.round(Math.random() * 999);
        const mouseDownY = Math.round(Math.random() * 999);

        fireEvent.mouseDown(dialogBoxTitle, { clientX: mouseDownX, clientY: mouseDownY });

        const mouseMoveX = Math.round(Math.random() * 999);
        const mouseMoveY = Math.round(Math.random() * 999);

        fireEvent.mouseMove(dialogBoxTitle, { clientX: mouseMoveX, clientY: mouseMoveY });

        const movedPosX = parseInt(dialogBox.style.left) - startLeft;
        const movedPosY = parseInt(dialogBox.style.top) - startTop;
        expect(movedPosX).toBe(mouseMoveX - mouseDownX);
        expect(movedPosY).toBe(mouseMoveY - mouseDownY);

        //Test mouse up
        fireEvent.mouseUp(dialogBoxTitle);        
        fireEvent.mouseMove(dialogBoxTitle, { clientX: Math.round(Math.random() * 999), clientY: Math.round(Math.random() * 999) });
        //Position should be the same as before
        expect(parseInt(dialogBox.style.left) - startLeft).toBe(movedPosX);
        expect(parseInt(dialogBox.style.top) - startTop).toBe(movedPosY);
    });
});