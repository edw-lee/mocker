import React from 'react';
import { SpreadsheetMenuEx } from './SpreadsheetMenuEx';
import * as GoogleSheet from '../../Managers/GoogleAPIs/GoogleSheet'
import * as IDBSheetManager from '../../Managers/IDB/IDBSheetManager'

//Future implementation: Add button to add sheets
export default class SpreadsheetMenuExClass extends React.Component {
    //TODO: Create a load button and refresh button

    constructor() {
        super();

        this.state = {
            spreadsheets: [],
        }

        this.addSpreadsheet = this.addSpreadsheet.bind(this);
    }

    componentDidMount() {
        IDBSheetManager.getAllSpreadSheets().then(spreadsheets => {
            //TODO: Check if spreadsheet still exists and remove those that does not exist anymore from the array
            if (this.state.spreadsheets !== spreadsheets)
                this.setState({ spreadsheets });
        }).catch(e => {
            console.log(e);
        });
    }

    addSpreadsheet() {
        GoogleSheet.getSpreadsheet().then(spreadsheet => {
            if (spreadsheet) {
                this.setState({ spreadsheets: [...this.state.spreadsheets, spreadsheet] });
                IDBSheetManager.addNewSpreadSheet(spreadsheet);
            }
        }).catch(e => {
            console.log(e);
        })
    }

    render() {
        return <SpreadsheetMenuEx tables={this.state.spreadsheets} parent={this} />
    }
}