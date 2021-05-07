import React from 'react';
import ComponentsIndex from '../../Components';
import './css/Editor.scss'

export default function Editor() {
    return (
        <div className='editor-outer'>
            <ComponentsIndex.MenuBarClass />
            <div className='editor-inner'>
                <ComponentsIndex.LeftMenuClass />
                <ComponentsIndex.WorkspaceClass />
                <ComponentsIndex.PropertiesClass />
            </div>
        </div>
    )
}
