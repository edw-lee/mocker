import React from 'react';
import Objects from '../Components/ObjectsMenuEx/Objects';
import { getRandom64 } from './Common';

/**
 * @param {Array} jsonObj 
 */

//TODO: Manage other props such as style, class, id
export function jsonObjToReact(jsonObj) {
    var content = [];
    const createReactEl = (obj) => {
        if (!obj) return;

        var { type, props, key } = obj;
        var children = props.children;

        if (!type) return;

        if (children && typeof (children) !== 'string') {
            var processedChildren = []

            //If it is an object but not an array, process it (in case its children contains objects/react elements)
            if (!(children instanceof Array))
                processedChildren.push(jsonObjToReact(children)[0]);
            else { //If it is an array, process accordingly                
                //If children is not undefined/null            
                children.forEach(child => {
                    if (typeof (child) === 'string') //If just a string, no need to process
                        processedChildren.push(child);
                    else
                        processedChildren.push(jsonObjToReact(child)[0]);
                });
            }

            children = processedChildren;
        }

        if (children)
            props.children = children;

        props.key = key ? key : createKeyId(type);

        //If not primitive type, get object from Objects folder in ComponentMenuEx
        if (Objects[type]) type = Objects[type];

        //Push a new react element along with the processed react elements into content
        content.push(React.createElement(type, props));
    }

    if(typeof(jsonObj) === 'string')
        jsonObj = JSON.parse(jsonObj);
        
    if (jsonObj instanceof Array)
        jsonObj.forEach(obj => createReactEl(obj));
    else
        createReactEl(jsonObj);

    return content;
}

export function reactToJsonObj(objects) {
    const toJson = _objects => {
        const result = [];

        _objects.forEach(obj => {
            if (!obj) return;

            var temp = obj;

            //Checks the object's key if it is not string or array
            if (typeof (obj) !== 'string' && !(obj instanceof Array)) {
                const key = obj.key ? obj.key : createKeyId(obj.type);

                let props = { ...obj.props };
                let children = obj.props.children;

                //Converts the children to json and checks the children keys too
                if (children && typeof (children) !== 'string') {
                    if (children instanceof Array)
                        children = toJson(children);
                    else
                        children = toJson([children])[0];

                    props.children = children;
                }

                temp = { ...obj, type: obj.type, key, props };
                //If object is an array, loop through the array and its children to check the keys and convert to json
            } else if (obj instanceof Array)
                temp = toJson(obj);

            result.push(temp)
        });

        return result;
    }

    return JSON.stringify(toJson(objects));
}

export function createKeyId(type) {
    type = type.toLowerCase();
    return `${type}-${getRandom64()}`;
}

function addKeyAndId(obj, noDataID) {
    var key = obj.key;
    var dataid = obj.props['data-id'];

    key = key ? key : dataid;
    dataid = dataid ? dataid : key;

    //Add key and data id if there is no key and data id
    if (!key && !dataid) {
        const newKeyId = createKeyId(obj.type);
        key = newKeyId;
        dataid = newKeyId;
    }

    let props = { ...obj.props, key };

    //Only add data-id if noDataID is false (if there is already data-id, then it won't be affected)
    if (!noDataID)
        props['data-id'] = dataid;

    return props;
}

export function processObjects(objects) {
    if (!(objects instanceof Array))
        objects = [objects];

    const _processObjects = (_objects, noDataID) => {
        if(!_objects) return;
        
        const newObjects = [];
        _objects.forEach(obj => {
            if (!obj) return;

            if (obj instanceof Array)
                return newObjects.push(_processObjects(obj, noDataID));
            
            //Add keys and data-id to the object
            let props = addKeyAndId(obj, noDataID);    

            //Process children
            let children = props.children
            if (children && typeof (children) !== 'string') {
                if (children instanceof Array)
                    children = _processObjects(children, true);
                else
                    children = _processObjects([children], true)[0];                
            }
            props.children = children;            

            newObjects.push(React.createElement(obj.type, props));
        });

        return newObjects;
    }

    return _processObjects(objects);
}
