import { CLOSE_DIALOGBOX, OPEN_DIALOGBOX } from "./ActionTypes";
import { createKeyId } from '../../Functions/ObjectProcessor'

const showDialogBox = (dialogbox, dispatch) => {    
    dialogbox.id = dialogbox.id !== undefined ? dialogbox.id : createKeyId('dialog-box');

    const definedOkFunction = dialogbox.okFunction;
    const definedCancelFunction = dialogbox.cancelFunction;

    const okFunction = () => {
        if (definedOkFunction) definedOkFunction();
        dispatch(closeDialogBox(dialogbox.id));
    }

    const cancelFunction = () => {
        if (definedCancelFunction) definedCancelFunction();
        dispatch(closeDialogBox(dialogbox.id));
    }
    
    dialogbox.okFunction = okFunction;
    dialogbox.cancelFunction = cancelFunction;
    dialogbox.showCancel = dialogbox.showCancel === undefined ? true : dialogbox.showCancel;
    dialogbox.showOk = dialogbox.showOk === undefined ? true : dialogbox.showOk;    

    return {
        type: OPEN_DIALOGBOX,
        payload: dialogbox
    }
}

const closeDialogBox = id => {
    return {
        type: CLOSE_DIALOGBOX,
        payload: id
    }
}

export { showDialogBox, closeDialogBox }