import React from 'react';
import { connect } from 'react-redux';
import Editor from './Editor/Editor';
import { createDialogBoxes } from '../Functions/Common';
import Loader from '../Components/Common/Loader';

function Main({ dialogboxes, isLoading }) {
    const dialogboxObjects = createDialogBoxes(dialogboxes)
    return (
        <>
            {isLoading && <Loader/>}
            {dialogboxObjects}
            <Editor />
        </>
    );
}

const mapStateToProps = state => {
    return {
        dialogboxes: state.dialogbox.dialogboxes,
        isLoading: state.editor.isLoading
    }
}

export default connect(mapStateToProps, null)(Main);