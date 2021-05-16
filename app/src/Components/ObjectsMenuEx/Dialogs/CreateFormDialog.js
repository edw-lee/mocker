import React from 'react';
import { SpreadsheetSelector } from '../../Common/SpreadsheetSelector';
import StyledRadioGroup from '../../Common/StyledRadioGroup';

export default class CreateFormDialog extends React.Component {
    formMethodRef = React.createRef();

    constructor(props)
    {
        super(props);

        this.state = {
            formType: 'Create'
        }
    }

    getFormType() {
        return this.formMethodRef.current.getOption();
    }

    getSelectedSheet() {
        return this.state.formType;
    }

    render() {
        return (
            <div>
                <StyledRadioGroup labels={['Create', 'Read', 'Update', 'Delete']} checkedValue={this.state.formType} onChange={e => this.setState({ formType: e.target.value })} />
                <SpreadsheetSelector ref={this.sheetSelectorRef} />
            </div>
        );
    }
}