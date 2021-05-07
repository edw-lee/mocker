import { DB_STORES_INFO, DB_NAME } from './IDBConstants';
import * as IDBManager from './IDBManager';

const PROJECT_STORE_NAME = Object.keys(DB_STORES_INFO)[0];

export function createNewProject(projectName) {
    return new Promise((resolve, reject) => {
        let projectStore = IDBManager.getObjectStore(PROJECT_STORE_NAME, 'readwrite');
        let newProject = { projectName };
        let req = projectStore.add(newProject);

        req.onerror = e => reject('Failed to create new project in', PROJECT_STORE_NAME, 'object store.');

        req.onsuccess = e => resolve(projectName);
    });
}

export function getProjectName() {
    return new Promise((resolve, reject) => {
        const projectStore = IDBManager.getObjectStore(PROJECT_STORE_NAME, 'readonly');
        const req = projectStore.getAll();

        req.onerror = e => reject('Failed to get project name');

        req.onsuccess = e => {
            const result = e.target.result;

            if (result.length)
                resolve(e.target.result[0].projectName);
            else
                resolve('');
        };
    });
}

export function updateProjectName(projectName) {
    return new Promise((resolve, reject) => {
        const projectStore = IDBManager.getObjectStore(PROJECT_STORE_NAME, 'readwrite');

        const req = projectStore.openCursor();
        req.onerror = e => reject('Failed to open cursor to update project name.');
        req.onsuccess = e => {
            /**@type{IDBCursor} */
            const cursor = e.target.result;

            if (cursor) {
                const updateReq = projectStore.put({ projectName }, cursor.primaryKey);

                updateReq.onerror = e => reject("Failed to update project name to", projectName, "with primary key of", cursor.primaryKey);
                updateReq.onsuccess = e => resolve();
            }
            else
                reject('No cursor was opened.');
        }
    });
}

export function deleteProject() {
    return IDBManager.clearStore(PROJECT_STORE_NAME);
}