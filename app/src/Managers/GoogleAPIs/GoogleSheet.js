import * as Google from './Google'

const gapi = window.gapi;

export function getSpreadsheet() {
    return new Promise((resolve, reject) => {
        Google.createPicker('application/vnd.google-apps.spreadsheet', spreadsheetId => {
            gapi.client.sheets.spreadsheets.get({ spreadsheetId })
                .then(result => {
                    resolve(result.result)
                }).catch(err => {
                    reject(err);
                });
        });
    });
}


export function getSheet(paramString) {
    return new Promise((resolve, reject) => {
        fetch(`googlesheet/${paramString}`).then(resp => {
            if (resp.error) return reject(resp.error);
            resp.json().then(result => resolve(result.sheet));
        });
    })
}