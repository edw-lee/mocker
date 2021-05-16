import React from 'react';
import './css/MenuListPlus.scss'

export default function MenuListPlus({className, addFunction, children}) {
    return (
        <div data-testid='menuListPlus' className={`menu-plus ${className}`}>
            <ul>
                {children}
            </ul>

            <i data-testid='menuListPlusBtn' className="fas fa-plus-circle plus-btn" onClick={addFunction}></i>
        </div>);
}