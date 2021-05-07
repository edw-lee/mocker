import React from 'react';
import DOMPurify from 'dompurify';
import { createKeyId } from '../../Functions/ObjectProcessor';
import { findHTMLObjWithDataID } from './WorkspaceClass';

const DOUBLECLICK_DELAY = 300; //5ms

export const checkDoubleClick = (dataid, selectedIds, container, objects, doubleClickCounter, setDoubleClickCounter, setEditingFlag, updateOneObject) => {
    //Adds to the mouse click counter, 
    //if it is 1 start a timeout timer for the second click and resets the counter if the timeout has expired
    let timer = null;
    if (doubleClickCounter == 0) {
        setDoubleClickCounter(1);
        timer = setTimeout(_ => setDoubleClickCounter(0), DOUBLECLICK_DELAY);
        //If it is 1 and it has the same id as the previous selected id, then this is the second click so execute double click
    } else if (selectedIds.length && dataid === selectedIds[0]) {
        doubleClick(dataid, container, objects, setEditingFlag, updateOneObject);
        setDoubleClickCounter(0);
        if (timer)
            clearTimeout(timer);
    }
}

export const doubleClick = (dataid, container, objects, setEditingFlag, updateOneObject) => {
    //The selected object will always be the first object because double only oocurs during single select event
    let target = findHTMLObjWithDataID(dataid, container);

    if (target) {
        //TODO: Moves this into a function in another script (Eg. ObjectFunctions.js)
        if (target.getAttribute('data-editable')) {
            const singleLine = target.getAttribute('data-singleline');

            //Makes content editable
            target.setAttribute('contenteditable', true);
            target.focus();

            //Set a flag to prevent dragging when editing                
            setEditingFlag(true);

            const onEnter = e => {
                if (e.key === 'Enter')
                    e.preventDefault();
            }

            //Prevent 'Enter' key from creating new line
            if (singleLine)
                target.addEventListener('keydown', onEnter);

            //Reset states on blur
            target.onblur = _ => {
                setEditingFlag(false);

                let idx = 0, object = null;

                //Find the jsx object
                for (var i = 0; i < objects.length; i++) {
                    const obj = objects[i];
                    if (obj.props['data-id'] === dataid) {
                        //Create a new key, so that React's renderer will replace the current DOM object.
                        //Using the object's existing key will cause duplicate bug
                        const key = createKeyId(obj.type);

                        const props = {};
                        //If there is a children prop, skip it because dangerouslySetInnerHTML will be used instead
                        Object.keys(obj.props).forEach(key => {
                            if (key !== 'children')
                                props[key] = obj.props[key];
                        });

                        //Create a new key so that React's renderer won't get buggy.
                        props.key = createKeyId(obj.type);

                        if (!singleLine)
                            props.dangerouslySetInnerHTML = {
                                //Use DOMPurify to remove dangerous HTML to prevent XSS attacks
                                __html: DOMPurify.sanitize(target.innerHTML)
                            };
                        else
                            //Since no newline is needed, textContent will suffice because it will remove and <div>s created
                            props.children = target.textContent;

                        //Create a new jsx object with the selected object's props but with updated content(dangerouslySetInnerHTML)
                        object = React.createElement(obj.type, props);
                        idx = i;
                        break;
                    }
                }

                //Set target back to non-editable
                if (target.getAttribute('data-editable'))
                    target.setAttribute('contenteditable', false);

                //Remove 'Enter' listener
                target.removeEventListener('keydown', onEnter);

                //Update the content of the object
                if (object)
                    updateOneObject(idx, object);
            }
        }
    }
}