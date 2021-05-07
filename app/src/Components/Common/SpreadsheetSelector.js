import React from 'react';
import * as IDBSheetManager from '../../Managers/IDB/IDBSheetManager'

export class SpreadsheetSelector extends React.Component {
    selectorRef = React.createRef();

    state = {
        sheets: []
    }

    componentDidMount() {
        IDBSheetManager.getAllSpreadSheets().then(sheets => {
            this.setState({ sheets });
        })
    }

    getValue() {
        return this.selectorRef.current.value;
    }

    render() {
        const spreadsheetOpts = this.state.sheets.map(sheet => {
            const { properties, sheets, spreadsheetId } = sheet;
            const spreadsheetTitle = properties.title;
            const sheetOpts = sheets.map(sheet => {
                const sheetTitle = sheet.properties.title
                const value = `${spreadsheetId}/${sheetTitle}`
                return <option key={value} value={value}>{sheetTitle}</option>
            })

            return <optgroup key={spreadsheetId} label={spreadsheetTitle}>{sheetOpts}</optgroup>
        });

        const placeholder = spreadsheetOpts.length ? '-Select a sheet-' : 'No sheet loaded yet.'

        return (
            <select style={{ width: '100%' }} ref={this.selectorRef} defaultValue=''>
                <option disabled={true} hidden={true} value=''>{placeholder}</option>
                {spreadsheetOpts}
            </select>
        );
    }
}