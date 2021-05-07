import { DB_STORES_INFO, DB_NAME } from './IDBConstants';
import * as IDBManager from './IDBManager'

const PAGE_STORE_NAME = Object.keys(DB_STORES_INFO)[1];

export function createNewPage(name, objects = '') {
    return new Promise((resolve, reject) => {
        let pageStore = IDBManager.getObjectStore(PAGE_STORE_NAME, 'readwrite');
        let newPage = { name, objects };
        let createPageReq = pageStore.add(newPage);

        createPageReq.onerror = (e) => {
            reject('Failed to create new page in', PAGE_STORE_NAME, 'object store.');
        };

        createPageReq.onsuccess = (e) => resolve(newPage);
    });
}

export function updatePage(name, objects) {
    return new Promise((resolve, reject) => {
        let pageStore = IDBManager.getObjectStore(PAGE_STORE_NAME, 'readwrite');
        let index = pageStore.index('name');

        let req = index.openCursor();

        req.onerror = (e) => {
            reject('Failed to open cursor.');
        }

        req.onsuccess = (e) => {
            /**@type{IDBCursor} */
            const cursor = e.target.result;

            if (cursor) {
                if (cursor.value.name === name) {
                    var data = cursor.value;

                    data.objects = objects;                    

                    let updateReq = pageStore.put(data, cursor.primaryKey);

                    updateReq.onerror = (e) => {
                        reject('Failed to update ', name);
                    }

                    updateReq.onsuccess = resolve(data);
                } else
                    cursor.continue();
            } else
                reject(`${name} page not found in ${DB_NAME}.`);
        }
    });
}

export function getPage(name) {
    return new Promise((resolve, reject) => {
        let pageStore = IDBManager.getObjectStore(PAGE_STORE_NAME, 'readonly');

        let index = pageStore.index('name');

        const req = index.openCursor()
        req.onsuccess = e => {
            /**@type{IDBCursor} */
            var cursor = e.target.result;
            if (cursor) {
                if (cursor.value.name === name) {
                    resolve(cursor.value);
                }
                else
                    cursor.continue();
            }
        }

        req.onerror = e => reject('Failed to open cursor.');
    });
}

export function getAllPages() {
    return new Promise((resolve, reject) => {
        let pageStore = IDBManager.getObjectStore(PAGE_STORE_NAME, 'readonly');

        let req = pageStore.getAll();

        req.onerror = (e) => {
            reject('Failed to retrieved page data.');
        }

        req.onsuccess = (e) => {
            resolve(e.target.result);
        }
    });
}

export function getTopFirstPage() {
    return new Promise((resolve, reject) => {
        let pageStore = IDBManager.getObjectStore(PAGE_STORE_NAME, 'readonly');

        if (!pageStore) reject(`${PAGE_STORE_NAME} store not found. Unable to retrieve top page.`);

        let req = pageStore.openCursor();

        req.onerror = (e) => {
            reject('Failed to retrieve top first page');
        }

        req.onsuccess = (e) => {
            /**
             * @type{IDBCursor}
             */
            var cursor = e.target.result;

            if (cursor)
                resolve(cursor.value);
            else
                reject('No page found.');
        }
    });
}

export function deletePage(name) {
    return new Promise((resolve, reject) => {
        let pageStore = IDBManager.getObjectStore(PAGE_STORE_NAME, 'readwrite');

        let req = pageStore.delete(name);

        req.onerror = (e) => {
            reject('Failed to delete ', name);
        }

        req.onsuccess = resolve;
    });
}

export function deleteAllPages() {
    return IDBManager.clearStore(PAGE_STORE_NAME);
}

export function checkPageExists(name) {
    return new Promise((resolve, reject) => {
        let pageStore = IDBManager.getObjectStore(PAGE_STORE_NAME, 'readonly');

        let req = pageStore.getKey(name);

        req.onerror = (e) => {
            reject('Failed to check if', name, 'exists.');
        }

        req.onsuccess = (e) => {
            resolve(e.target.result !== undefined);
        }
    });
}

export function isPageStoreEmpty() {
    return new Promise((resolve, reject) => {
        let pageStore = IDBManager.getObjectStore(PAGE_STORE_NAME, 'readonly');

        let req = pageStore.count()

        req.onerror = (e) => reject(e);

        req.onsuccess = (e) => resolve(e.target.result);
    })
}