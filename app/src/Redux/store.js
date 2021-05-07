import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import dialogBoxReducer from './DialogBox/DialogBoxReducer'
import menuBarReducer from './MenuBar/MenuBarReducer';
import workspaceReducer from './Workspace/WorkspaceReducer'
import editorReducer from './Editor/EditorReducer';
import {composeWithDevTools} from 'redux-devtools-extension'

const rootReducer = combineReducers({
    dialogbox: dialogBoxReducer,
    menubar: menuBarReducer,
    workspace: workspaceReducer,
    editor: editorReducer
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;