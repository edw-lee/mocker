import { TOGGLE_LOAD_STATE, UPDATE_PROJECT_NAME } from "./ActionTypes";

const initialState = {
    projectName: undefined,
    isLoading: false
}

const editorReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_LOAD_STATE: {
            return {
                ...state,
                isLoading: action.payload
            }
        }
        case UPDATE_PROJECT_NAME: {
            return {
                ...state,
                projectName: action.payload
            }
        }
        default:
            return state;        
    }
}

export default editorReducer;