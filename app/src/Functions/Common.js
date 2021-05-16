import React from 'react';
import ReactDOM from 'react-dom';
import DialogBox from '../Components/Common/DialogBox';
import fontFamilies from '../Constants/font_families.json';
import { jsonObjToReact } from './ObjectProcessor';
import { saveAs } from 'file-saver'

export function getRandom64() {
    return Math.round(Math.random() * 65536).toString(16);
}

export function numberToAlphabet(number) {
    return String.fromCharCode((number % 26) + 65);
}

/**
 * 
 * @param {dialogBoxType} details 
 */
export function createDialogBox({ id, title, msg, okText, showOk, showCancel, cancelText, okFunction, cancelFunction, boxClass, titleclass, msgClass, btnGrpClass, okBtnClass, cancelBtnClass }) {
    return <DialogBox key={id} title={title} msg={msg} okText={okText} showOk={showOk}
        showCancel={showCancel} cancelText={cancelText} okFunction={okFunction}
        cancelFunction={cancelFunction} boxClass={boxClass}
        titleclass={titleclass} msgClass={msgClass} btnGrpClass={btnGrpClass}
        okBtnClass={okBtnClass} cancelBtnClass={cancelBtnClass} />
}

export function createDialogBoxes(dialogboxes) {
    if (!(dialogboxes instanceof Array)) dialogboxes = [dialogboxes];

    return dialogboxes.map(dialogbox => {
        return createDialogBox(dialogbox);
    });
}

/**
 * @param {DOMRect} rect1 
 * @param {DOMRect} rect2 
 */
export function checkOverlapRect(rect1, rect2) {
    return !(rect1.top > rect2.bottom || rect1.bottom < rect2.top || rect1.left > rect2.right || rect1.right < rect2.left);
}

/**
 * @param {DOMPoint} point1 
 * @param {DOMPoint} point2 
 */
export function getDistanceSqr(point1, point2) {
    const x = point1.x - point2.x;
    const y = point1.y - point2.y;

    return (x * x) + (y * y);
}

var googleFontUrl = "https://fonts.googleapis.com/css2?";
export function getGoogleFontsUrl() {
    //If the googleFontUrl is not the same as the base url, it is assumed that the url was generated before
    //So dont need to generate again and just return what was generated
    if (googleFontUrl !== "https://fonts.googleapis.com/css2?") return googleFontUrl;

    Object.keys(fontFamilies).forEach(fontFamily => {
        if (fontFamily === 'Default') return;

        googleFontUrl += `family=${fontFamily.replace(/\s/g, '+')}&`;
    });

    googleFontUrl += "display=swap";

    return googleFontUrl;
}

export function extractString(source, extract) {
    const startIdx = source.indexOf(extract);

    return source.substring(startIdx, startIdx + extract.length);
}

/**
 * @param {Blob} data 
 * @param {String} name 
 * @param {String} extension 
 */
export function download(data, name, extension) {
    if (!extension) extension = 'mock';
    if (!name) name = `${Date.now()}.${extension}`;

    saveAs(data, `${name}`);
}

export function createHTML(content, title) {
    /**@type{HTMLIFrameElement} */
    const exportFrame = document.getElementById('export-frame');
    const contentDoc = exportFrame.contentDocument;
    const container = contentDoc.getElementById('container');

    if (content.length <= 0)
        return;

    //Render the page to the workspace
    ReactDOM.render(jsonObjToReact(content), container);

    //Add font families link
    const fontFamiliesLink = contentDoc.getElementById('fontfamilieslink');
    if (fontFamiliesLink)
        fontFamiliesLink.href = getGoogleFontsUrl();

    if (title)
        exportFrame.contentDocument.title = title;

    //Get the workspace content
    const htmlContent = "<!DOCTYPE html>\n" + exportFrame.contentDocument.documentElement.innerHTML;

    return htmlContent;
}

export function createHTMLBlob(page) {
    const html = createHTML(page);

    const htmlFile = new Blob([html], { type: 'text/html' });

    return htmlFile;
}

/** 
 * @callback successCallback
 * @param{XMLHttpRequest} response
 */

/** 
 * @callback failureCallback
 * @param{String} responseText
 */

/**
 * @param {String} url 
 * @param {successCallback} success 
 * @param {failureCallback} failure 
 */
export function sendXMLRequest(url, success, failure, responseType = 'blob') {
    const req = new XMLHttpRequest();

    req.onreadystatechange = ()=> {
        if (req.readyState === XMLHttpRequest.DONE) {
            const status = req.status;
            if (status === 0 || (status >= 200 && status < 400))
                success(req.response)
            else
                failure(req.responseText);
        }
    };

    req.responseType = responseType;

    req.open("GET", url);
    req.send();
}

export function getFileNamesFromPublic(dir, filter) {
    return new Promise((resolve, reject) => {
        fetch(`${process.env.REACT_APP_BACKENDURL}/readpublicdir?dir=${dir}`)
            .then(resp => resp.json())
            .then(resp => {
                if (resp.files) {
                    let filenames = resp.files;

                    if (filter)
                        filenames = filenames.filter(filter);

                    resolve(filenames);
                } else
                    reject('No files found.');
            })
            .catch(err => reject(err));
    });
}

/** 
 * @param {Blob} blob 
 */
export function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onerror = e => reject('Failed to convert blob to base64.');
        reader.onloadend = ()=> resolve(reader.result);
    });
}