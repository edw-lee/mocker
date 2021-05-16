import React from 'react';
import { createKeyId } from '../../Functions/ObjectProcessor';

/**
 * @param {{labels:string[], name:string, layout:string}} props 
 */
export default function RadioButtonGroup({labels, name, layout, objType}) {
    if(!labels) labels = [];
    if(!name) name = '';
    
    const radioButtons = labels.map((label) => {
        const id = createKeyId('rb');
        const labelKey = createKeyId('lbl');
        const inputKey = createKeyId('radio');
        return (
            <span key={id}>
                <input type='radio' key={inputKey} id={id} name={name} />
                <label key={labelKey} htmlFor={id}>{label}</label>
            </span>
        )
    });

    const layoutStyle = { display: 'flex', flexDirection: `${layout === 'v' ? 'column' : 'row'}` };

    return (
        <div data-testid='radioButtonGroup' style={layoutStyle} data-objtype={objType}>
            {radioButtons}
        </div>
    );
}