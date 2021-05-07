import React from 'react';
import { MenuList } from '../Common'
import './css/MenuBar.scss'
import * as GoogleDrive from '../../Managers/GoogleAPIs/GoogleDrive'
import { createKeyId } from '../../Functions/ObjectProcessor'
import { Undo, Redo } from '@material-ui/icons'
import * as IDBManager from '../../Managers/IDB/IDBManager'
import * as GoogleManager from '../../Managers/GoogleAPIs/Google'
import { connect } from 'react-redux'
import { closeDialogBox, showDialogBox } from '../../Redux/DialogBox/DialogBoxActions';
import { login, logout } from '../../Redux/MenuBar/MenuBarActions'
import { createNewPage, deleteAllPages, getAllPages } from '../../Managers/IDB/IDBPageManager';
import { redo, setCurrentPage, undo } from '../../Redux/Workspace/WorkspaceActions';
import SaveLoadDialog from './SaveLoadDialog';
import { blobToBase64, createHTML, download, getFileNamesFromPublic, sendXMLRequest } from '../../Functions/Common';
import { toggleLoadState, setProjectName } from '../../Redux/Editor/EditorActions';
import JSZip from 'jszip';
import { getProjectName, updateProjectName as IDBUpdateProjectName } from '../../Managers/IDB/IDBProjectManager';
import { DEFAULT_PROJECT_NAME, MAX_PROJECT_NAME_LEN } from '../../Constants/constants';


class MenuBarClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectNameInput: ''
        }
    }

    menuBarItemsArr = [
        {
            title: 'New Project',
            display: <i className='far fa-file'></i>,
            function: _ => this.newProject()
        },
        {
            title: 'Open Project',
            display: <i className='far fa-folder-open'></i>,
            function: _ => this.openProject()
        },
        {
            title: 'Save Project',
            display: <i className='far fa-save'></i>,
            function: _ => this.saveProject()
        },
        {
            title: 'Export to HTML',
            display: <i className='fas fa-file-code'></i>,
            function: _ => this.export()
        },
        {
            title: 'Undo',
            display: <Undo />,
            function: _ => this.props.undo()
        },
        {
            title: 'Redo',
            display: <Redo />,
            function: _ => this.props.redo()
        }
    ];

    componentDidMount() {
        GoogleManager.initClient(this.updateLogin);

        //Retrieve the project name from the IDB
        getProjectName().then(projectName => {
            this.setState({ projectNameInput: projectName });

            //Set the project name in the redux state
            this.props.setProjectName(projectName);
        });

    }

    /**
     * @param {String} projectName 
     */
    updateProjectName = projectName => {
        //Truncate the project name if its too long
        if (projectName.length > MAX_PROJECT_NAME_LEN)
            projectName.substr(0, MAX_PROJECT_NAME_LEN);
        //Otherwise set it to the default project name if its empty
        else if (!projectName)
            projectName = DEFAULT_PROJECT_NAME;

        //Update the project name if the input value is not the same as the project name in the redux state
        if (projectName !== this.props.projectName) {
            //Update IDB (for saving the project)
            IDBUpdateProjectName(projectName);
            //Update the redux state (so that other components can refer to it instead of constantly retrieving from IDB)
            this.props.setProjectName(projectName);
        }

        //Update input if the project name is not the same
        if (projectName !== this.state.projectNameInput)
            this.setState({ projectNameInput: projectName });
    }

    updateLogin = user => {
        if (user)
            this.props.login(user);
        else
            this.props.logout();
    }

    newProject = () => {
        this.props.showDialogBox({
            title: 'Create New Project',
            //TODO: Add function to check if there are unsave work
            msg: 'Are you sure? All your unsaved work will be lost.',
            okFunction: () => {
                IDBManager.clearAllStores().then(() => {
                    window.location.reload();
                }).catch(e => console.log(e));
            }
        })
    }

    promptStorageDialog = (title, localCallback, driveCallback, isLoadLocalFile = false) => {
        const dialogBoxId = createKeyId('dialog-box');
        this.props.showDialogBox({
            id: dialogBoxId,
            title: title,
            msg: <SaveLoadDialog closeDialogBox={_ => this.props.closeDialogBox(dialogBoxId)}
                localCallback={localCallback} driveCallback={driveCallback} isLoadLocalFile={isLoadLocalFile} />,
            showOk: false,
            showCancel: false
        });
    }

    saveProject = _ => {
        const { projectName } = this.props;

        const createContentBlob = pages => new Blob(
            //Converts the JSON to a string and then convert to a Hex string                
            [btoa(JSON.stringify({ projectName, pages }))],
            { type: 'application/octet-stream' }
        );

        const saveToDrive = _ => {
            this.props.toggleLoadState(true);

            const failedToSave = e => {
                this.props.showDialogBox({
                    title: 'Failed to Save',
                    msg: e,
                    showCancel: false
                });

                this.props.toggleLoadState(false);
            }

            getAllPages().then(pages => {
                const blob = createContentBlob(pages);
                GoogleDrive.updloadBlobToDrive(blob, `${projectName}.mock`, blob.type,
                    _ => {
                        this.props.showDialogBox({
                            title: 'Saved',
                            msg: 'Project has been successfully saved to Google Drive.',
                            showCancel: false
                        });

                        this.props.toggleLoadState(false);
                    }, failedToSave).catch(failedToSave);
            }).catch(e => failedToSave('Project failed to save to Google Drive.'));
        }

        const saveToLocal = _ => {
            this.props.toggleLoadState(true);

            getAllPages().then(pages => {
                download(createContentBlob(pages), `${projectName}.mock`);
            }).catch(e => console.log(e))
                .finally(_ => this.props.toggleLoadState(false));
        }

        this.promptStorageDialog('Save Project', saveToLocal, saveToDrive);
    }

    openProject = _ => {
        const loadPages = data => {
            this.props.toggleLoadState(true);
            //Convert the data back to JSON string and parse it
            data = JSON.parse(atob(data));
            const { projectName, pages } = data;

            //Delete old pages and set new pages with the loaded data
            if (pages && pages.length)
                deleteAllPages().then(_ => {
                    //Create new pages with loaded data
                    pages.forEach(page => createNewPage(page.name, page.objects));
                    //Set current page to the first page
                    this.props.setCurrentPage(pages[0].name);
                });

            if (projectName)
                this.updateProjectName(projectName);

            this.props.toggleLoadState(false);
        }

        const openFromDrive = _ => {
            GoogleDrive.load(data => loadPages(data));
        }

        /**        
         * @param {React.ChangeEvent<HTMLInputElement>} e 
         */
        const openFromLocal = e => {
            const file = e.target.files[0];
            if (!file)
                return console.log('File was not provided');

            const reader = new FileReader();
            reader.onload = e => {
                const contents = e.target.result;
                loadPages(contents);
            }

            reader.readAsText(file);
        }

        this.promptStorageDialog('Open Project', openFromLocal, openFromDrive, true);
    }

    export = _ => {
        let timeout;

        const _export = downloadCallback => {
            const resetTimeout = _ => {
                if (timeout)
                    clearTimeout(timeout);

                timeout = setTimeout(_ => {
                    this.props.showDialogBox({
                        title: 'Export Timeout',
                        msg: 'Export timeout. Failed to generate export file. Please refresh and try again',
                        showCancel: false
                    });
                    this.props.toggleLoadState(false);
                }, 30000);
            };

            resetTimeout();

            getAllPages().then(pages => {
                const zip = JSZip();

                //Loop through the pages and convert it to HTML files and add to the zip file
                pages.forEach(page => {
                    const html = createHTML(page.objects, page.name);

                    if (html)
                        zip.file(page.name + '.html', html);
                });

                //Array of flags to check if all getFiles processes have completed
                const getFilesDoneFlags = [];
                //To store all file names
                const allFileNames = [];

                const downloadZip = _ => {
                    zip.generateAsync({ type: 'blob' })
                        .then(blob => downloadCallback(blob),
                            err => console.log(err));
                }

                //Add file and check if it is done            
                const addFilesToZip = _ => {
                    let fileCount = 0;

                    if (getFilesDoneFlags.every(flag => flag)) {
                        allFileNames.forEach(filename => {
                            sendXMLRequest(filename,
                                file => {
                                    zip.file(filename, file);

                                    fileCount++;

                                    if (fileCount === allFileNames.length)
                                        downloadZip()
                                    else
                                        //Reset the timeout since there is progress but not completed yet
                                        resetTimeout();
                                },
                                err => console.log(err));
                        });
                    }
                }

                const getFiles = (dir, filter) => {
                    //To keep track of the state of the file retrieval process
                    const flagIdx = getFilesDoneFlags.length;
                    getFilesDoneFlags.push(false);

                    getFileNamesFromPublic(dir, filter).then(filenames => {
                        filenames.forEach(filename => allFileNames.push(`/${dir}/${filename}`));
                        getFilesDoneFlags[flagIdx] = true;

                        if (getFilesDoneFlags.every(flag => flag))
                            addFilesToZip();

                    }).catch(err => {
                        console.log(err)
                        this.props.toggleLoadState(false);
                    });
                }

                //Get CSS
                getFiles('css', filename => filename.match(/^.+\.css$/g));

                //Get images
                getFiles('images');

                //Get scripts
                getFiles('scripts');

                //Get Font Awesome's webfonts
                getFiles('fontawesome');
            }).catch(e => {
                console.log(e);
                this.props.toggleLoadState(false);
            });
        }

        const exportToDrive = _ => {
            this.props.toggleLoadState(true);

            const completed = (title, msg) => {
                this.props.showDialogBox({ title, msg, showCancel: false });

                this.props.toggleLoadState(false);
                clearTimeout(timeout);
            }

            _export(blob => {
                GoogleDrive.updloadBlobToDrive(blob, `${this.props.projectName}.zip`, blob.type,
                    _ => completed('Export to Drive Successful', 'Project has been successfully exported to your Google Drive.'),
                    e => completed('Export to Drive Failed', e))
                    .catch(e => completed('Export to Drive Failed', e));
            });
        }

        const exportToLocal = _ => {
            this.props.toggleLoadState(true);

            _export(blob => {
                download(blob, this.props.projectName, 'zip');

                this.props.toggleLoadState(false);
                clearTimeout(timeout);
            });
        }

        this.promptStorageDialog('Export Project', exportToLocal, exportToDrive);
    }

    render() {
        const user = this.props.user

        const menuBarItems = this.menuBarItemsArr.map(item => {
            return <li key={item.title} title={item.title}
                onClick={item.function}>{item.display}</li>
        });

        return (
            <div className='menu-bar-container'>
                <div className='menu-bar-logo'>Mocker</div>
                <MenuList className='menu-bar'>
                    <input value={this.state.projectNameInput} maxLength={MAX_PROJECT_NAME_LEN}
                        onChange={e => this.setState({ projectNameInput: e.target.value })}
                        onBlur={e => this.updateProjectName(this.state.projectNameInput)} />
                    {menuBarItems}
                </MenuList>
                {
                    user ?
                        <React.Fragment>
                            <span className='menu-userinfo-box'>
                                <div className='menu-username'>{user.displayName}</div>
                                <div>{user.emailAddress}</div>
                            </span>
                            <button className='menu-login-btn' onClick={GoogleManager.signOut}>Logout</button>
                        </React.Fragment>
                        :
                        <button className='menu-login-btn' onClick={GoogleManager.signIn}>Login</button>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.menubar.user,
        objects: state.workspace.objects,
        projectName: state.editor.projectName
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleLoadState: isLoading => dispatch(toggleLoadState(isLoading)),
        showDialogBox: dialogbox => dispatch(showDialogBox(dialogbox, dispatch)),
        closeDialogBox: id => dispatch(closeDialogBox(id)),
        login: user => dispatch(login(user)),
        logout: _ => dispatch(logout()),
        setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage)),
        setProjectName: projectName => dispatch(setProjectName(projectName)),
        undo: _ => dispatch(undo()),
        redo: _ => dispatch(redo())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBarClass)