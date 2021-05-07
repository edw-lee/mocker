import {TOGGLE_LOAD_STATE, UPDATE_PROJECT_NAME} from './ActionTypes';

export const toggleLoadState = isLoading => {    
    return {
        type: TOGGLE_LOAD_STATE,
        payload: isLoading
    }
}

export const setProjectName = projectName => {
    return {
        type: UPDATE_PROJECT_NAME,
        payload: projectName
    }
}