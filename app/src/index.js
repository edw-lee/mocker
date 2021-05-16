//This has to be at the top to prevent dependencies errors
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as IDBManager from './Managers/IDB/IDBManager'
import { getGoogleFontsUrl } from './Functions/Common';
import { createNewProject, getProjectName } from './Managers/IDB/IDBProjectManager';
import { DEFAULT_PROJECT_NAME } from './Constants/constants';

IDBManager.init().then(() => {
  document.getElementById('fontfamilieslink').setAttribute('href', getGoogleFontsUrl());

  //Get project name and set it if there's no project name (*happens when the project is new)
  getProjectName().then(projectName => {
    if (!projectName)
      createNewProject(DEFAULT_PROJECT_NAME);
  }).catch(e =>
    console.log(e)
  ).finally(()=>
    ReactDOM.render(
      <App />,
      document.getElementById('root')
    )
  );
}).catch(e => ReactDOM.render(<p>{e}</p>, document.getElementById('root')));
