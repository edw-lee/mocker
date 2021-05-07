import React from 'react';
import { createKeyId } from '../../Functions/ObjectProcessor';

/**
 * @param {{labels:string[], name, layout}} props 
 */
export function RadioButtonGroup(props) {
    const radioButtons = props.labels.map((label) => {
        const id = createKeyId('rb');
        const labelKey = createKeyId('lbl');
        const inputKey = createKeyId('radio');
        return (
            <span key={id}>
                <input type='radio' key={inputKey} id={id} name={props.name} />
                <label key={labelKey} htmlFor={id}>{label}</label>
            </span>
        )
    });

    const layoutStyle = { display: 'flex', flexDirection: `${props.layout === 'v' ? 'column' : 'row'}` };

    return (
        <div style={layoutStyle} data-objtype={props['data-objtype']}>
            {radioButtons}
        </div>
    );
}