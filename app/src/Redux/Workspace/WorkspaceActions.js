import { jsonObjToReact } from "../../Functions/ObjectProcessor";
import { ADD_OBJECTS, DESELECT_ALL, DESELECT_OBJECT, REDO, REPLACE_OBJECTS, SELECT_OBJECT, SELECT_ONE_OBJECT, SET_CURRENT_PAGE, UNDO, UPDATE_ONE_OBJECT } from "./ActionTypes"
import * as IDBPageManager from '../../Managers/IDB/IDBPageManager'
import { processObjects } from "../../Functions/ObjectProcessor";

export const addObjects = objects => {    
    return {
        type: ADD_OBJECTS,
        payload: processObjects(objects)
    }
};

export const replaceObjects = (objects, isDragging) => {    
    return {
        type: REPLACE_OBJECTS,
        payload: {objects:processObjects(objects), isDragging}
    }
}

export const updateOneObject = (idx, object) => {    
    return {
        type: UPDATE_ONE_OBJECT,
        payload: {idx, object}
    }
}

export const setCurrentPage = currentPage => {
    return dispatch => {
        IDBPageManager.getPage(currentPage).then(page => {
            let objects = [];
            if (page.objects.length)
                objects = jsonObjToReact(JSON.parse(page.objects));
            
            dispatch({
                type: SET_CURRENT_PAGE,
                payload: { currentPage, objects }
            });            
        }).catch(e => {
            console.log(e);
        });
    }
}

export const selectOneObject = (dataid, objtype) => {
    return {
        type: SELECT_ONE_OBJECT,
        payload: { dataid, objtype }
    }
}

export const selectObject = (dataid, objtype) => {
    return {
        type: SELECT_OBJECT,
        payload: { dataid, objtype }
    }
}

export const deselectObject = (dataid, objtype) => {
    return {
        type: DESELECT_OBJECT,
        payload: { dataid, objtype }
    }
}

export const deselectAll = ()=> {
    return {
        type: DESELECT_ALL
    }
}

export const undo = ()=> {
    return {
        type: UNDO
    }
}

export const redo = ()=> {
    return {
        type: REDO
    }
}