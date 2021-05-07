import React from 'react';
import { POSITION } from './WorkspaceClass';

export const getAllSelected = (objects, selectedIds) => {
    const selectedObjs = [];

    const _getAllSelected = objects => {
        objects.forEach(obj => {
            if (!obj || !obj.props) return;

            let children = obj.props.children;

            if (children && typeof (children) !== 'string') {
                if (!(children instanceof Array))
                    children = [children];

                _getAllSelected(children);
            }

            if (selectedIds.includes(obj.props['data-id']) && !selectedObjs.includes(obj))
                selectedObjs.push(obj);
        });
    }

    _getAllSelected(objects);

    return selectedObjs;
}

export const move = (objects, selectedObjs, nearestDataId, selectedIds, position) => {
    if (!(objects instanceof Array))
        objects = [objects];

    let nearestIdx = -1; //Stores the nearest object's index    

    //To sort out the non-selected objects    
    const nonselected = [];

    objects.forEach(obj => {
        if (!obj) return;

        if(obj instanceof Array)
            return nonselected.push(move(obj, selectedObjs, nearestDataId, selectedIds, position));
        
        const dataid = obj.props['data-id'];
        let children = obj.props.children;

        if (children) {
            let newChildren = children;
            //Check if the nearest data id is in the children or not and arrange it accordingly            
            if (typeof (children) !== 'string')
                newChildren = move(children, selectedObjs, nearestDataId, selectedIds, position);

            if (newChildren !== children)
                obj = React.createElement(obj.type, { ...obj.props, key: obj.key, children: newChildren });
        }

        //Get the index of the object (by using the data-id) that was hovered over
        if (nearestDataId === dataid)
            nearestIdx = nonselected.length;

        if (!selectedIds.includes(dataid) && !nonselected.includes(obj))
            nonselected.push(obj);

    });

    if (nearestIdx !== -1) {
        const obj = nonselected[nearestIdx];
                
        //If the nearest object is a layout object, it means that it has no children, so just put the selected objects as the children
        if (obj.type === 'td' || obj.props['data-islayout'] && position === POSITION.INSIDE) {
            let children = obj.props.children;

            if (children) {
                if (children instanceof Array)
                    children = [...children, ...selectedObjs];
                else
                    children = [children, ...selectedObjs];
            } else {
                children = selectedObjs;
            }

            nonselected[nearestIdx] = React.createElement(obj.type, { ...obj.props, key: obj.key, children });
            return nonselected;
        } else {
            if (position === POSITION.AFTER)
                nearestIdx++;

            return [...nonselected.slice(0, nearestIdx), ...selectedObjs, ...nonselected.slice(nearestIdx)];
        }
    }
    else
        return nonselected;
}