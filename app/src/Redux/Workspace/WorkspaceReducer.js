import { ADD_OBJECTS, DESELECT_ALL, DESELECT_OBJECT, REDO, REPLACE_OBJECTS, SELECT_OBJECT, SELECT_ONE_OBJECT, SET_CURRENT_PAGE, UNDO, UPDATE_ONE_OBJECT } from "./ActionTypes"
import * as IDBPageManager from '../../Managers/IDB/IDBPageManager'
import { reactToJsonObj } from "../../Functions/ObjectProcessor";
import { MAX_HISTORY_BUFFER_SIZE } from "../../Constants/constants";

const initialState = {
    currentPage: '',
    objects: [],
    selectedIds: [],
    selectedObjTypes: {},
    history: [],
    historyIdx: 0
}

function addHistory(state, currentState, newState) {    
    if (currentState === newState) return state;

    //Push the current state if history is empty
    if (!state.history.length)
        state.history.push(currentState);
    else
        //Truncate the history based on the history index
        //This shows where the user is currently viewing the history 
        //and when new updates is added, the history after the index is no longer valid
        state.history = state.history.slice(0, state.historyIdx + 1);

    const historyLength = state.history.length;
    //If the history size is longer the max size, truncate the earlier histories
    if(historyLength > MAX_HISTORY_BUFFER_SIZE)
        state.history = state.history.slice(historyLength - MAX_HISTORY_BUFFER_SIZE, historyLength);

    //Get the latest index for the history state below
    state.historyIdx = state.history.length;

    //Push the new state
    state.history.push(newState);

    return state;
}

const workspaceReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_PAGE:
            if (state.currentPage !== action.payload)
                return {
                    ...state,
                    objects: action.payload.objects,
                    currentPage: action.payload.currentPage
                };
            else
                return state
        case ADD_OBJECTS: {
            const objects = [...state.objects, ...action.payload];

            IDBPageManager.updatePage(state.currentPage, reactToJsonObj(objects)).catch(e => {
                console.log(e);
            });

            state = addHistory(state, { objects: state.objects }, { objects });

            return {
                ...state,
                objects
            }
        }
        case REPLACE_OBJECTS:
            const { objects, isDragging } = action.payload;

            IDBPageManager.updatePage(state.currentPage, reactToJsonObj(objects)).catch(e => {
                console.log(e);
            });            

            //Only update the history if the objects are not being dragged
            if (!isDragging)
                state = addHistory(state, { objects: state.objects }, { objects });

            return {
                ...state,
                objects
            }
        case UPDATE_ONE_OBJECT: {
            const { idx, object } = action.payload;

            let objects = [...state.objects];
            objects[idx] = object;

            IDBPageManager.updatePage(state.currentPage, reactToJsonObj(objects)).catch(e => {
                console.log(e);
            });

            state = addHistory(state, { objects: state.objects }, { objects });

            return {
                ...state,
                objects
            }
        }
        case SELECT_ONE_OBJECT: {
            const { dataid, objtype } = action.payload;

            const selectedObjTypes = {};
            selectedObjTypes[objtype] = 1;

            return {
                ...state,
                selectedIds: [dataid],
                selectedObjTypes
            }
        }
        case SELECT_OBJECT: {
            const { dataid, objtype } = action.payload;
            const selectedObjTypes = { ...state.selectedObjTypes };
            if (selectedObjTypes[objtype])
                selectedObjTypes[objtype] += 1;
            else
                selectedObjTypes[objtype] = 1;

            return {
                ...state,
                selectedIds: [...state.selectedIds, dataid],
                selectedObjTypes
            }
        }
        case DESELECT_OBJECT: {
            const { dataid, objtype } = action.payload;
            const selectedIds = state.selectedIds;
            const selectedObjTypes = { ...state.selectedObjTypes };

            selectedObjTypes[objtype] -= 1;

            if (selectedObjTypes[objtype] <= 0)
                delete selectedObjTypes[objtype];

            return {
                ...state,
                selectedIds: selectedIds.filter(id => id !== dataid),
                selectedObjTypes
            }
        }
        case DESELECT_ALL:
            return {
                ...state,
                selectedIds: [],
                selectedObjTypes: {}
            }
        case UNDO: {
            if (!state.history.length) return state;

            const idx = Math.max(0, Math.min(state.historyIdx - 1, state.history.length - 1));

            if (idx === state.historyIdx) return state;

            return {
                ...state,
                selectedIds: [],
                selectedObjTypes: {},
                ...state.history[idx],
                historyIdx: idx
            }
        }
        case REDO: {
            if (!state.history.length) return state;

            const idx = Math.max(0, Math.min(state.historyIdx + 1, state.history.length - 1));

            if (idx === state.historyIdx) return state;

            return {
                ...state,
                selectedIds: [],
                selectedObjTypes: {},
                ...state.history[idx],
                historyIdx: idx
            }
        }
        default:
            return state;
    }
}

export default workspaceReducer;