import { LOGIN, LOGOUT } from "./ActionTypes"

const initialState = {
    user: null
}

const menuBarReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                user: action.payload
            };
        case LOGOUT:
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
}

export default menuBarReducer;