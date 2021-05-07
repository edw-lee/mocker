import { OPEN_DIALOGBOX, CLOSE_DIALOGBOX } from './ActionTypes'

const initialState = {
    dialogboxes: []
}

const dialogBoxReducer = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_DIALOGBOX:
            
            return {
                ...state,
                dialogboxes: [...state.dialogboxes, action.payload]
            };
        case CLOSE_DIALOGBOX:            
            return {
                ...state,
                dialogboxes: state.dialogboxes.filter(dialogbox => dialogbox.id !== action.payload)
            };
        default:
            return state;
    }
}

export default dialogBoxReducer;