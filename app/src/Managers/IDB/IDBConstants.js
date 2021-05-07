export const DB_NAME = 'mockerdb'
export const DB_STORES_INFO = {
    Project: {autoIncrement:true},
    Page: { autoIncrement: true, indices: [{ name: 'name', keyPath: 'name', unique: true }]},
    SpreadSheet: { autoIncrement: true, indices: [{ name: 'spreadsheetId', keyPath: 'spreadsheetId', unique: 'true' }] }
}

export const TIMEOUT = 30000;