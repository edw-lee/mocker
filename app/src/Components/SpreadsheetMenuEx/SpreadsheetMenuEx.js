import React from 'react';
import MenuList from '../Common/MenuList';
//eslint-disable-next-line
import { SpreadsheetMenuExClass } from './SpreadsheetMenuExClass';
import './css/SpreadsheetMenuEx.scss';

/**
 * 
 * @param {{tables:Array, parent:SpreadsheetMenuExClass}} props 
 */
export function SpreadsheetMenuEx(props) {
    const tables = props.tables.map(table => {
        const tableTitle = table.properties.title;
        const tableTitleDiv = <div className='spreadsheet-title'>{tableTitle}</div>
        const tableSheets = table.sheets.map(sheet => {
            const { properties } = sheet;
            return <li key={properties.sheetId} className='sheet-title'>{properties.title}</li>
        });

        return (
            <li key={table.properties.title}>
                {tableTitleDiv}
                <MenuList className='sheet-list'>
                    {tableSheets}
                </MenuList>
            </li>
        )
    });

    return (
        <div className='spreadsheet-menu'>
            <div className='top-control'>
                <button onClick={props.parent.addSpreadsheet}><i className='fas fa-plus'></i></button>
                <button><i className='fas fa-sync-alt'></i></button>
            </div>
            {tables.length ? <MenuList>{tables}</MenuList> :
                <span className='no-spreadsheet-text'>No spreadsheet loaded</span>}
        </div>
    );
}