import { objectMenuItems } from './ObjectsMenuItems'
import './css/ObjectsMenuEx.scss'
import React from 'react';
import { connect } from 'react-redux'
import { addObjects } from '../../Redux/Workspace/WorkspaceActions';
import { showDialogBox } from '../../Redux/DialogBox/DialogBoxActions';

function ObjectsMenuEx({ addObjects, showDialogBox }) {
    const componentGroups = Object.keys(objectMenuItems).map(key => {
        if (objectMenuItems[key].hidden) return null;

        const components = objectMenuItems[key].objects.map(object => {
            if(object.hidden) return null

            return (
                <div key={object.name} className='cmpnt-icon-grp' onClick={_ => object.create(addObjects, showDialogBox)}>
                    <div className='cmpnt-icon'>{object.icon}</div>
                    <div>{object.name}</div>
                </div>
            )
        });

        return (
            <div key={key}>
                <div className='cmpnt-grp-lbl'>{key}</div>
                <div className='cmpnt-grp'>
                    {components}
                </div>
            </div>
        );
    });

    return (
        <div>
            {componentGroups}
        </div>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        addObjects: objects => dispatch(addObjects(objects)),
        showDialogBox: dialogbox => dispatch(showDialogBox(dialogbox, dispatch))
    }
}

export default connect(null, mapDispatchToProps)(ObjectsMenuEx);