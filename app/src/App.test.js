import { cleanup, render } from '@testing-library/react'
import App from './App'
import * as IDBManager from './Managers/IDB/IDBManager'
import { createNewProject, getProjectName } from './Managers/IDB/IDBProjectManager';
import { DEFAULT_PROJECT_NAME } from './Constants/constants';
import 'fake-indexeddb/auto';

afterEach(cleanup);

describe('App', () => {
    test('Renders without errors', () => {
        const div = document.createElement('div');
        const gapiScript = document.createElement('script');
        gapiScript.src = 'https://apis.google.com/js/api.js';

        try {
            async () => {
                await IDBManager.init().then(() => {
                    //Get project name and set it if there's no project name (*happens when the project is new)
                    getProjectName().then(projectName => {
                        if (!projectName)
                            createNewProject(DEFAULT_PROJECT_NAME);
                    }).catch(e =>
                        console.log(e)
                    ).finally(() =>
                        render(<App />, div)
                    );
                }).catch(e => ReactDOM.render(<p>{e}</p>, document.getElementById('root')));

            }
        } catch (e) {
            console.log(e);
        }
    });
});