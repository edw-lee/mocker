import React, { useCallback, useEffect, useState } from 'react';
import './css/DialogBox.scss'

export const dialogBoxType = {
    id: null, title: null, msg: null, okText: null, showOk: true, showCancel: true, cancelText: null, okFunction: null, cancelFunction: null,
    boxClass: null, titleclass: null, msgClass: null, btnGrpClass: null, okBtnClass: null, cancelBtnClass: null
};

export function DialogBox({ title, msg, okText, showOk, showCancel, cancelText, okFunction,
    cancelFunction, boxClass, titleclass, msgClass, btnGrpClass, okBtnClass, cancelBtnClass }) {

    const overlayRef = React.createRef();
    const dialogboxRef = React.createRef();
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [posOffset, setPosOffset] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    if (!msg) msg = '(No message provided.)';
    if (showOk && !okText) okText = 'Okay';
    if (!boxClass) boxClass = 'dialogbox';
    if (!titleclass) titleclass = 'dialogbox-title';
    if (!msgClass) msgClass = 'dialogbox-msg';
    if (!btnGrpClass) btnGrpClass = 'dialogbox-btn-grp';
    if (!okBtnClass) okBtnClass = 'dialogbox-ok-btn';
    if (!cancelBtnClass) cancelBtnClass = 'dialogbox-cancel-btn';
    if (showCancel && !cancelText) cancelText = 'Cancel'

    //Find the first text input to focus on so that the enter and escapde key will be fired
    useEffect(() => {
        /**@type{HTMLElement} */
        let overlay = overlayRef.current;
        var isInputFound = false;

        const checkChildnodes = (childNodes) => {
            if (isInputFound) return;

            for (var i = 0; i < childNodes.length; i++) {
                let child = childNodes[i];

                if (child.childNodes.length > 0)
                    checkChildnodes(child.childNodes);

                if (isInputFound) break;

                if (child instanceof HTMLInputElement && child.type === 'text') {
                    child.focus();
                    isInputFound = true;
                    break;
                }
            }
        }

        checkChildnodes(overlay.childNodes);

        if (!isInputFound) overlay.focus();

    }, [overlayRef]);

    const initPos = useCallback(_ => {
        /**@type{HTMLElement} */
        const dialogbox = dialogboxRef.current;
        /**@type{HTMLElement} */
        const overlay = overlayRef.current;

        const dialogboxRect = dialogbox.getBoundingClientRect();
        const overlayRect = overlay.getBoundingClientRect();

        const x = overlayRect.width / 2 - dialogboxRect.width / 2;
        const y = overlayRect.height / 2 - dialogboxRect.height / 2;

        setPos({ x, y });
        setOpacity(1);
    }, [dialogboxRef, overlayRef]);

    //Set the position of the dialog box on component mount
    //Set the display to block (it was initially set to none to prevent flickering when the position is updated)
    // eslint-disable-next-line
    useEffect(() => initPos(), []);

    /**
     * @param {React.KeyboardEvent} e 
     */
    const onKeyUp = (e) => {
        if (showOk && e.key === 'Enter')
            validate(e);
        else if (e.key === 'Escape')
            cancelFunction(e);
    }

    const validate = e => {
        if (dialogboxRef.current.checkValidity())
            okFunction(e);
    }

    const onSubmit = e => {
        e.preventDefault();
        validate(e);
    }

    /**     
     * @param {React.MouseEvent} e 
     */
    const onMouseDown = e => {
        setPosOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
        setIsDragging(true);
    }
    /**     
     * @param {React.MouseEvent} e 
     */
    const onMouseMove = e => {
        if (isDragging)
            setPos({ x: e.clientX - posOffset.x, y: e.clientY - posOffset.y });
    }
    /**     
     * @param {React.MouseEvent} e 
     */
    const onMouseUp = e => {
        setIsDragging(false);
    }

    return (
        <div className='dialogbox-overlay'
            style={{ opacity }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            tabIndex={0} ref={overlayRef} onKeyUp={(e) => onKeyUp(e)}>
            <form className={boxClass} style={{ left: pos.x, top: pos.y }} onSubmit={onSubmit} ref={dialogboxRef}>
                <div onMouseDown={onMouseDown} className={titleclass}>
                    {title}

                    <button type='button' onClick={cancelFunction} className='icon-btn close-btn'>
                        <i className='fas fa-times'></i>
                    </button>
                </div>
                <div className={msgClass}>{msg}</div>
                <div className={btnGrpClass}>
                    {showOk && <button type='submit' className={okBtnClass}>{okText}</button>}
                    {showCancel && <button className={cancelBtnClass} onClick={cancelFunction}>{cancelText}</button>}
                </div>
            </form>
        </div>
    );
}