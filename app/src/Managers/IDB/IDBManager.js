import * as IDBSheetManager from './IDBSheetManager'
import * as IDBPageManager from './IDBPageManager'
import * as IDBProjectManager from './IDBProjectManager'
import { DB_NAME, DB_STORES_INFO } from './IDBConstants';
import { DEFAULT_FIRST_PAGE_NAME } from '../../Constants/constants';

/**
 * @type{IDBDatabase}
 */
export var db;

export function init() {
    console.log('Initializing', DB_NAME);
    if (!window.indexedDB)
        return alert('Your browser is not supported. The application will not work correctly.');

    return new Promise((resolve, reject) => {
        let idb = window.indexedDB;
        let req = idb.open(DB_NAME, 1);

        req.onerror = (e) => {
            console.log('Failed to open', DB_NAME, e.target.error);
            reject();
        }

        req.onupgradeneeded = (e) => {
            /**
             * @type{IDBDatabase}
             */
            var db = e.target.result;

            console.log('Upgrading', DB_NAME);

            /**
             * TODO: version handling 
             * Ref:
             * https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB - Version Handling section
             * https://javascript.info/indexeddb, 
             * https://dev.to/ivandotv/handling-indexeddb-upgrade-version-conflict-368a         
            */
            Object.keys(DB_STORES_INFO).forEach(key => {
                console.log('Creating', key, 'object store.');

                var os = DB_STORES_INFO[key];
                let newStore = db.createObjectStore(key, { keyPath: os.keyPath, autoIncrement: os.autoIncrement });

                if (os.indices) {
                    os.indices.forEach(index => {
                        newStore.createIndex(index.name, index.keyPath, { unique: index.unique });
                    });
                }

                if (newStore)
                    console.log(key, 'object store created.');
            })
        }

        req.onsuccess = (e) => {
            db = e.target.result;

            IDBPageManager.isPageStoreEmpty()
                .then(count => {
                    if (!count) {
                        IDBPageManager.checkPageExists(DEFAULT_FIRST_PAGE_NAME)
                            .then(result => {
                                if (!result)
                                    IDBPageManager.createNewPage(DEFAULT_FIRST_PAGE_NAME).then(() => resolve()).catch(e => reject(e));
                                else
                                    resolve();
                            }).catch(e => reject(e));
                    } else
                        resolve();
                }).catch(e => reject(e));

            console.log(DB_NAME, 'initialized.');
        }
    });
}

/**
 * 
 * @param {string} storeName 
 * @param {IDBTransactionMode} mode 
 */
export function getObjectStore(storeName, mode) {
    if (!db) return;

    let trx = db.transaction(storeName, mode);
    return trx.objectStore(storeName);
}

export function clearStore(storeName) {
    return new Promise((resolve, reject) => {
        let req = getObjectStore(storeName, 'readwrite').clear();

        req.onerror = (e) => {
            reject('Failed to clear ', storeName, ' object store.');
        }

        req.onsuccess = resolve;
    });
}

export function clearAllStores() {
    return new Promise((resolve, reject) => {
        var isPageCleared = false, isTableCleared = false, isProjectCleared = false;

        let checkIsAllCleared = () => {
            if (isPageCleared) console.log('Page cleared');
            if (isTableCleared) console.log('Table cleared');
            if (isProjectCleared) console.log('Project cleared');

            if (isPageCleared && isTableCleared && isProjectCleared)
                resolve();
        }

        IDBPageManager.deleteAllPages().then(() => {
            isPageCleared = true;
            checkIsAllCleared();
        }).catch(e => reject(e));

        IDBSheetManager.deleteAllSpreadSheets().then(() => {
            isTableCleared = true;
            checkIsAllCleared();
        }).catch(e => reject(e));

        IDBProjectManager.deleteProject().then(() => {
            isProjectCleared = true;
            checkIsAllCleared();
        }).catch(e => reject(e));
    })
}