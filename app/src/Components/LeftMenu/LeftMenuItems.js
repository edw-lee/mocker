import React from 'react';
import ComponentsIndex from '..'

//Note: Must use a function instead of a json object because the Components imported will not be assigned if its a json object
export default function LeftMenuItems() {
    return {
        Pages:
        {
            icon: <i className='far fa-copy'></i>,
            menu: <ComponentsIndex.PageMenuExClass />
        },
        Hierarchy:
        {
            icon: <i className='fas fa-stream'></i>,
            menu: <ComponentsIndex.HierarchyMenuExClass />
        },
        Objects:
        {
            icon: <i className='far fa-object-group'></i>,
            menu: <ComponentsIndex.ObjectsMenuEx />
        },
        Spreadsheets:
        {
            icon: <i className='fas fa-table'></i>,
            menu: <ComponentsIndex.SpreadsheetMenuExClass />,
            hidden: true
        },
        Roles:
        {
            icon: <i className='fas fa-users'></i>,
            menu: <div>Roles</div>,
            hidden: true
        }
    };
}