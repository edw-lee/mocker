import React from 'react';
import { SpreadsheetSelector } from '../../Common/SpreadsheetSelector';
import { StyledRadioGroupClass } from '../../Common/StyledRadioGroupClass';

export default class CreateFormDialog extends React.Component {
    formMethodRef = React.createRef();
    sheetSelectorRef = React.createRef();

    getFormType() {
        return this.formMethodRef.current.getOption();
    }

    getSelectedSheet() {
        return this.sheetSelectorRef.current.getValue();
    }

    render() {    
        return (
            <div>
                <StyledRadioGroupClass ref={this.formMethodRef} labels={['Create', 'Read', 'Update', 'Delete']} checkedValue='Create' />
                <SpreadsheetSelector ref={this.sheetSelectorRef}/>
            </div>
        );
    }
}