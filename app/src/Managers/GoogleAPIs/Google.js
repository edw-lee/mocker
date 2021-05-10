import { getBackendUrl } from "../../Functions/Common";

const DEV_KEY = process.env.REACT_APP_DEV_KEY;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const APP_ID = process.env.REACT_APP_APP_ID;

const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets';
const DISCOVER_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest", "https://sheets.googleapis.com/$discovery/rest?version=v4"];

var isPickerAPILoaded = false;
var oAuthToken = '';

var gapi = window.gapi;
var google = window.google;

/**
 * @type {WebSocket}
 */
var authWS;

var updateSignInStatus = null;

export const AUTH_TIMEOUT = 10 * 60 * 1000;

export function initClient(_updateSignInStatus) {
    updateSignInStatus = _updateSignInStatus;

    const init = _ => {
        console.log('Initializing Google client...')
        gapi.client.init({
            apiKey: DEV_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES,
            discoveryDocs: DISCOVER_DOCS
        }).then(_ => {
            const authInstance = gapi.auth2.getAuthInstance();

            authInstance.isSignedIn.listen(handleSignInStatus);                        

            const isSignedIn = authInstance.isSignedIn.get();
            handleSignInStatus(isSignedIn);


        }, e => console.log(e));
    }

    gapi.load('client:auth2', init);
}

function handleSignInStatus(isSignedIn) {
    if (isSignedIn) {
        gapi.client.drive.about.get({ fields: 'user' }).execute(resp => {            
            oAuthToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
            
            //To register new user if it was not registered
            fetch(`${getBackendUrl()}/login`, {
                method: 'POST',
                body: JSON.stringify({ user: resp.user }),
                headers: { 'Content-Type': 'application/json' }
            }).catch(e => console.log(e));

            updateSignInStatus({ displayName: resp.user.displayName, emailAddress: resp.user.emailAddress });
        });
    } else
        updateSignInStatus(null);
}

export function signIn() {
    if (gapi.auth2)
        gapi.auth2.getAuthInstance().signIn().catch(e => console.log(e));
}

export function signOut() {
    gapi.auth2.getAuthInstance().signOut().then(_ => {
        oAuthToken = '';
        handleSignInStatus(false);
    }).catch(e => console.log(e));
}

function checkToken() {
    return new Promise((resolve, reject) => {
        fetch('/google/checktoken').then(resp => {
            resp.text().then(hasToken => {
                resolve(hasToken === 'true');
            });
        }).catch(e => reject(e));
    })
}

export function authorize(callback) {
    if (!callback) return console.log('No callback provided');
    //Checks if user's Google account already has a token registered
    checkToken().then(hasToken => {
        if (hasToken) {
            callback();
        } else {
            //Authorize Google account and get the token for NodeJs server
            fetch('/google/authurl').then(resp => {
                resp.text().then(authUrl => {
                    if (authUrl) {
                        if (authWS && (authWS.readyState === WebSocket.OPEN || authWS.readyState === WebSocket.CONNECTING)) authWS.close();

                        var wsID = btoa(Math.random().toString());
                        var state = btoa(JSON.stringify({ wsID }));
                        authUrl += `&state=${state}`
                        authWS = new WebSocket(`ws://localhost:5000/${wsID}`);
                        var authWSTimeout;
                        var authWindow;

                        authWS.onopen = _ => {
                            authWindow = window.open(authUrl, 'Auth Window', 'width=480,height=640');
                            authWSTimeout = setTimeout(() => {
                                authWS.close();
                                authWindow.close();
                            }, AUTH_TIMEOUT);
                        };

                        authWS.onclose = _ => {
                            clearTimeout(authWSTimeout);
                            console.log('Mocker\'s websocket closed.', authWS.readyState);
                        }

                        authWS.onmessage = e => {
                            try {
                                var data = JSON.parse(e.data);

                                if (data.authstate === 'success') {
                                    authWindow.close();
                                    authWS.close();
                                    callback();
                                }
                            } catch (err) {
                                console.log(e.data);
                            }
                        }
                    } else {
                        return console.log('Failed to retrieve authorization url.');
                    }
                })
            })
        }
    });
}


function loadPicker() {    
    return new Promise((resolve, reject) => {
        if (!oAuthToken) {
            alert('Please login first.');

            return reject();
        }

        if (!isPickerAPILoaded) {
            gapi.load('picker', () => {
                isPickerAPILoaded = true;
                google = window.google;
                resolve();
            });
        } else
            resolve();
    });
}

export function createPicker(mimetype, callback) {
    loadPicker().then(() => {
        var view = new google.picker.DocsView(google.picker.ViewId.DOCS);
        view.setMimeTypes(mimetype);
        var picker = new google.picker.PickerBuilder()
            .setAppId(APP_ID)
            .setOAuthToken(oAuthToken)
            .addView(view)
            .setDeveloperKey(DEV_KEY)
            .setCallback((data) => pickerCallback(data, callback))
            .build();

        picker.setVisible(true);
    }).catch(e => console.log(e));
}

function pickerCallback(data, callback) {
    if (data.action === google.picker.Action.PICKED) {
        var fileId = data.docs[0].id;

        if (callback) callback(fileId);
    }
}