import { useState } from "react";

export default function ColorPicker({ value = '#000000', onChange }) {
    const [_value, setValue] = useState(value);

    const clearColor = () => {
        if (onChange)
            onChange('');
        setValue('#000000');
    }

    const _onChange = val => {
        setValue(val);
        if (onChange)
            onChange(val);
    }

    return (
        <span data-testid='colorPicker'>
            <input data-testid='colorPickerInput' type='color' value={_value} onChange={e => _onChange(e.target.value)}
                style={{ width: '20px', borderRadius: '2px', padding: '0 1px', marginRight: '5px' }} />
            <button data-testid='colorPickerClearBtn' className='icon-btn' onClick={clearColor}>
                <i className='fas fa-times'></i>
            </button>
        </span>
    )
}