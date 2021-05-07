import { DB_STORES_INFO } from './IDBConstants';
import * as IDBManager from './IDBManager'

const SPREADSHEET_STORE_NAME = Object.keys(DB_STORES_INFO)[1];
//TODO: Rename to IDBSheetManager
export function addNewSpreadSheet(newTable) {
    return new Promise((resolve, reject) => {
        let tableStore = IDBManager.getObjectStore(SPREADSHEET_STORE_NAME, 'readwrite');
        
        let req = tableStore.add(newTable);

        req.onerror = e => reject(e);

        req.onsuccess = e => resolve(newTable);
    });
}

export function getAllSpreadSheets() {
    return new Promise((resolve, reject) => {
        let tableStore = IDBManager.getObjectStore(SPREADSHEET_STORE_NAME);

        let req = tableStore.getAll();

        req.onerror = e => reject(e);

        req.onsuccess = e => resolve(e.target.result);
    })
}

export function getSpreadSheet(id) {

}

export function deleteAllSpreadSheets() {
    return IDBManager.clearStore(SPREADSHEET_STORE_NAME);
}
