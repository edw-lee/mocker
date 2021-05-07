import * as Google from './Google'

const gapi = window.gapi;

//TODO: Try using DocsUploadView from Google Picker to select folder to upload to
export function upload(content, name) {
    if (content) {
        Google.authorize(() => {
            console.log('upload called!');

            var url = `/googledrive/uploadfile`;

            if (!name)
                name = Date.now() + ".html";

            var file = new File([content], name, { type: 'text/html' });
            var formData = new FormData();
            formData.append('drivehtml', file);

            fetch(url, { method: 'POST', body: formData }).then(resp => {
                resp.text().then(data => console.log('Upload file response: ', data));
            }).catch(err => {
                console.log('Error: ', err);
            });
        });
    }
}

export function updloadTextToDrive(content, contentType, name, callback) {
    return new Promise((resolve, reject) => {
        if (!content) reject();

        if (!gapi.client || !gapi.auth2.getAuthInstance().isSignedIn.get()) {
            reject('Please login first.');
        } else if (content) {
            _uploadTextToDriveRequest(content, contentType, name, callback);
            resolve();
        }
    });
}

function _uploadTextToDriveRequest(content, contentType, name, callback) {
    var url = "https://www.googleapis.com/upload/drive/v3/files";

    var boundary = 'mockerfile';

    if (!name || name.length === 0)
        name = Date.now() + ".txt";

    var metadata = {
        'name': name,
    };

    var delimeter = `\r\n--${boundary}\r\n`;
    var closeDelimeter = `\r\n--${boundary}--`;

    var body =
        delimeter
        + 'Content-Type:application/json\r\n\r\n'
        + JSON.stringify(metadata)
        + delimeter
        + `Content-Type:${contentType}\r\n\r\n`
        + `${content}`
        + closeDelimeter

    gapi.client.request({
        path: url,
        method: 'POST',
        params: { 'uploadType': 'multipart' },
        headers: {
            'Content-Type': `multipart/mixed; boundary=${boundary}`
        },
        body: body,
    }).execute(callback);
}


export function updloadBlobToDrive(blob, name, mimeType, successCallback, errorCallback) {
    return new Promise((resolve, reject) => {
        if (!blob) return reject('No blob provided.');

        if (!gapi.client || !gapi.auth2.getAuthInstance().isSignedIn.get()) {
            reject('Please login first.');
        } else if (blob) {
            _updloadBlobToDrive(blob, name, mimeType, successCallback, errorCallback);
            resolve();
        }
    });
}

function _updloadBlobToDrive(blob, name, mimeType, successCallback, errorCallback) {
    var url = "https://www.googleapis.com/upload/drive/v3/files";    
    
    gapi.client.drive.files.create({
        'content-type': 'application/json',
        uploadType: 'multipart',
        name,
        mimeType,
        fields: 'id'
    }).then(resp => {
        fetch(`${url}/${resp.result.id}`, {
            method: 'PATCH',
            headers: new Headers({
                'Authorization': `Bearer ${gapi.client.getToken().access_token}`,
                'Content-Type': mimeType
            }),
            body: blob
        }).then(successCallback).catch(errorCallback);
    }).catch(errorCallback);
}

export function load(callback) {
    Google.createPicker('application/octet-stream', fileId => {
        gapi.client.drive.files.get({ fileId, alt: 'media' })
            .then(data => callback(data.body))
            .catch(e => console.log(e));
        // Google.authorize(() => {
        //     fetch(`/googledrive/file?fileId=${fileId}`).then(resp => {
        //         resp.text().then(text => {
        //             callback(text);
        //         });
        //     });
        // });
    });
}

//#region DEPRECATED
// function uploadHTMLToDrive(html?: string, name?: string) {
//     if (!html) return;

//     if (!gapi.client || (gAuth && !gAuth.isSignedIn.get())) {
//         gapi.load('client:auth2', () => initClient(() => _uploadHTMLToDrive(html, name)));
//     } else if (html) {
//         _uploadHTMLToDrive(html, name);
//     }
// }

// function _uploadHTMLToDrive(html?: string, name?: string) {

//     var url = "https://www.googleapis.com/upload/drive/v3/files";

//     var boundary = 'mockerfile';

//     if (!name)
//         name = Date.now() + ".html";

//     var metadata = {
//         'name': name,
//     };

//     html = '<!DOCTYPE html>\r\n' + html;

//     var delimeter = `\r\n--${boundary}\r\n`;
//     var closeDelimeter = `\r\n--${boundary}--`;

//     var body =
//         delimeter
//         + 'Content-Type:application/json\r\n\r\n'
//         + JSON.stringify(metadata)
//         + delimeter
//         + 'Content-Type:text/html\r\n\r\n'
//         + `${html}`
//         + closeDelimeter

//     gapi.client.request({
//         path: url,
//         method: 'POST',
//         params: { 'uploadType': 'multipart' },
//         headers: {
//             'Content-Type': `multipart/mixed; boundary=${boundary}`
//         },
//         body: body,
//     }).execute(() => console.log('Uploaded!'));
// }

// function showFiles(callback: (link?: string) => any) {
//     if (!gapi.client || (gAuth && !gAuth.isSignedIn.get())) {
//         gapi.load('client:auth2', () => initClient(() => _showFiles(callback)));
//     } else
//         _showFiles(callback);
// }

// function _showFiles(callback: (link?: string) => any) {
//     gapi.client.drive.files.list({
//         q: "mimeType='text/plain' and trashed=false",
//         spaces: 'drive'
//     })
//         .execute((resp) => {
//             if (resp.result) {
//                 var files = resp.result.files!;

//                 if (files.length > 0)
//                     loadHTML(files[0], callback);
//                 else
//                     alert('No files found.');
//             }
//         });
// }
// //TODO: Put the entire GoogleDrive manager to NodeJS server
// //TODO: Place this function in NodeJS server
// //-> Download the file using webContentLink 
// //-> Pass the file content back to frontend to update the iframe
// function loadHTML(file: gapi.client.drive.File, callback: (link?: string) => any) {
//     gapi.client.drive.files.get({ fileId: file.id!, fields: 'webContentLink' })
//         .execute((resp) => {
//             if (resp)
//                 console.log(resp);
//             else
//                 alert(`Failed to retrieve file with file id ${file.name}`)
//         });
// }

//#endregion