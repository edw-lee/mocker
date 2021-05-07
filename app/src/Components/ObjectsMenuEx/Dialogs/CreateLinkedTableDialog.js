import React from 'react';
import { SpreadsheetSelector } from '../../Common/SpreadsheetSelector';

export default class CreateLinkedTableDialog extends React.Component {
    sheetSelectorRef = React.createRef();

    getSheetId() {
        return this.sheetSelectorRef.current.getValue();
    }

    render() {
        return (
            <div>
                <SpreadsheetSelector ref={this.sheetSelectorRef} />
            </div>
        );
    }
}