import { checkOverlapRect } from "../../Functions/Common";
import { findHTMLObjWithDataID, POSITION } from "./WorkspaceClass";

export const findNearestObj = (objects, selectedIds, mousePos, container) => {
    let position = POSITION.BEFORE;

    const checkVertically = _objects => {
        if (!_objects || !_objects.length) return;

        let nearestObjs = [];
        let minDistAbs = Number.POSITIVE_INFINITY;

        for (var i = 0; i < _objects.length; i++) {
            const obj = _objects[i];

            if (!obj || !obj.props) continue;

            const dataid = obj.props['data-id'];

            //If selected, then can be skipped
            if (selectedIds.includes(dataid)) continue;

            //Table cell act likes a layout but objects cant be place before or after it
            const isTableCell = obj.props['data-istablecell']
            const isLayout = obj.props['data-islayout'];

            //Get html DOM element and calculate the center Y
            const htmlDom = findHTMLObjWithDataID(dataid, container);
            const rect = htmlDom ? htmlDom.getBoundingClientRect() : new DOMRect();
            const halfHeight = htmlDom ? rect.height / 2 : 0;
            const centerY = htmlDom ? rect.y + halfHeight : 0;

            //Check the children if there is no html DOM element or mouse pos is within the object
            //and skip the processes below
            let children = obj.props.children;
            if (children && typeof (children) !== 'string' && (!htmlDom || checkOverlapRect(new DOMRect(mousePos.x, mousePos.y, 0, 0), rect))) {
                if (!(children instanceof Array))
                    children = [children];

                const result = checkVertically(children);

                if (result && result.minDistAbs < minDistAbs) {
                    minDistAbs = result.minDistAbs;
                    position = result.position;
                    nearestObjs = result.nearestObjs;                    
                    
                    //If a children has is the minimum then skip the processes below.
                    //This is so that children will always be priotized as the nearest object
                    continue;
                }
            }

            //Compare the mouse position distance to the center Y with the previous min distance
            const yDist = centerY - mousePos.y
            const yDistAbs = Math.abs(yDist);

            //If it is not a table cell then check distance as usual
            if (!isTableCell) {
                if (yDistAbs < minDistAbs) {
                    minDistAbs = yDistAbs;
                    //Remove the previous stored nearest objects and store the current one only.
                    //Store along with the rect so that it can be reused to calculate the horizontal distances
                    nearestObjs = [{ obj, rect }];

                    //If its a layout object and the mouse position Y is within the object, then place it inside                
                    if (isLayout && yDistAbs <= halfHeight)
                        position = POSITION.INSIDE;
                    //If distance is negative then place it before the object, otherwise place it after
                    else if (yDist > 0)
                        position = POSITION.BEFORE;
                    else
                        position = POSITION.AFTER;

                    //If the distance is the same then it is on the same row,
                    //Add it to the nearestObjs array so that it can be used to calculate the horizontal distances                 
                } else if (yDistAbs === minDistAbs)
                    nearestObjs.push({ obj, rect });
                //If it is a table cell and the mouse pos is within the table cell, then only check the min distance
                //*This is because object cant be placed before or after the table cell, so only need to check if it is inside else just ignore it
            } else if (checkOverlapRect(new DOMRect(mousePos.x, mousePos.y, 0, 0), rect) && yDistAbs < minDistAbs) {
                minDistAbs = yDistAbs;
                nearestObjs = [{ obj, rect }];
                position = POSITION.INSIDE;
            }
        }

        return { nearestObjs, minDistAbs, position };
    }

    const checkHorizontally = nearestObjs => {
        if (!nearestObjs || !nearestObjs.length) return;

        //No need to calculate if there's only one object
        if (nearestObjs.length === 1) return nearestObjs[0].obj.props['data-id'];

        let minDistAbs = Number.POSITIVE_INFINITY;
        let nearestDataId = nearestObjs[0].obj.props['data-id'];

        nearestObjs.forEach(result => {
            if (!result) return;

            const { obj, rect } = result;

            if (!obj || !obj.props || !obj.props['data-id']) return;

            const halfWidth = rect.width / 2;
            const centerX = rect.x + halfWidth;

            //Table cell act likes a layout but objects cant be place before or after it
            const isTableCell = obj.props['data-istablecell']

            //Compare the mouse position distance to the center X with the previous min distance
            const xDist = centerX - mousePos.x;
            const xDistAbs = Math.abs(xDist);

            if (xDistAbs < minDistAbs) {
                minDistAbs = xDistAbs;
                nearestDataId = obj.props['data-id'];

                //*If position was set to INLAYOUT when calculating the vertical distances, then it is a layout object
                //If it is INLAYOUT and not a table cell, check if the X distance is outside the object, if it is inside, then no need to do anything.                          
                if (!isTableCell || position === POSITION.INSIDE && xDistAbs > halfWidth) {
                    //If it is outside then it is not INLAYOUT, then check if it is BEFORE or AFTER
                    if (xDist > 0)
                        position = POSITION.BEFORE;
                    else
                        position = POSITION.AFTER;
                }
            }

        });

        return nearestDataId;
    }

    //Check vertically first
    const { nearestObjs } = checkVertically(objects);

    //Then check horizontally if there are multiples found
    const nearestDataId = checkHorizontally(nearestObjs);

    return { nearestDataId, position };
};