import React, { useState } from 'react';
import './css/StyledRadioButtonGroup.scss'

/**
 * @param {{labels:string[], values:string[], checkedValue:string, onChange:React.ChangeEvent=>any, name:string}} props 
 */
export default function StyledRadioGroup({ labels, values, checkedValue, onChange, name }) {
    const [option, setOption] = useState(checkedValue);

    const _onChange = e => {
        setOption(e.target.value);

        if(onChange)
            onChange(e);
    }

    const radioButtons = labels.map((label, idx) => {
        const id = `rb-${name}-${label}`;
        const value = values ? values[idx] : label;
        const checked = value === option;
        return (
            <span key={id} className='styled-rb'>
                <input type='radio' id={id} name={name} value={value} checked={checked} onChange={e => _onChange(e)} />
                <label htmlFor={id}>{label}</label>
            </span>
        )
    });

    return (
        <div data-testid='styledRadioGroup' className='styled-rb-grp' >
            { radioButtons}
        </div>
    );
}