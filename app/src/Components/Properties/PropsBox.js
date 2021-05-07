import React from 'react';
import './css/PropsBox.scss'

export default function PropsBox({ title, children }) {
    return (
        <div className='propsbox'>
            <div className='propsbox-title'>{title}</div>
            <div className='propsbox-body'>
                {children}
            </div>
        </div>
    )
}