import React from 'react';
import './css/MenuList.scss';

export function MenuList(props) {
    const className = props.className? `menu-list ${props.className}` : 'menu-list'
    return (
        <div className={className}>            
            <ul>
                {props.children}
            </ul>
        </div>
    );
}