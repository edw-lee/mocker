import React from 'react';
import './css/MenuList.scss';

export default function MenuList({className, children}) {
    const _className = className? `menu-list ${className}` : 'menu-list'
    return (
        <div data-testid='menuList' className={_className}>            
            <ul>
                {children}
            </ul>
        </div>
    );
}