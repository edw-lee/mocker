import React from 'react';
import './css/MenuListPlus.scss'

export function MenuListPlus(props) {
    return (
        <div className={`menu-plus ${props.className}`}>
            <ul>
                {props.children}
            </ul>

            <i className="fas fa-plus-circle plus-btn" onClick={props.addFunction}></i>
        </div>);
}