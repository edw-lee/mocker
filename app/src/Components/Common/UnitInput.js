import { useEffect, useState } from "react";

export const unitArr = ['cm', 'mm', 'in', 'px', 'pt', 'pc', 'em', 'ex', 'ch', 'rem', 'vw', 'vh', 'vmin', 'vmax', '%'];
export const defaultUnit = 'px';

function getUnit(value)
{
    let unit = '';
    for(let i = 0; i < value.length; i++)
    {
        if(!Number.isNaN(Number.parseInt(value[i])))
        {
            unit = '';
            continue;
        } else
            unit += value[i];
    }

    if(unit.length)
        return unit;
    else
        return undefined;
}

/**
 * @param {string} value 
 */
function parseValue(value) {
    let parsed = Number.parseFloat(value);

    if (!value.length || Number.isNaN(parsed))
        return '';

    parsed = parsed.toString();
    let unit = getUnit(value);

    if (!unit || !unitArr.includes(unit))
        unit = defaultUnit;

    return `${parsed}${unit}`;
}

export default function UnitInput({ style, placeholder, selectedValue, onBlur, title }) {
    if(!selectedValue)
        selectedValue = '';

    const [value, setValue] = useState(parseValue(selectedValue));
    const [_placeholder, setPlaceholder] = useState(placeholder);

    const onChange = e => {
        setValue(e.target.value);
    }

    const _onBlur = val => {
        setValue(val);
        if (onBlur && typeof (selectedValue) !== 'undefined')
            onBlur(val);
    }

    useEffect(()=> {
        if (typeof (selectedValue) !== 'undefined') {
            setValue(selectedValue);
            setPlaceholder(placeholder);
        }
        else {
            setValue('');
            setPlaceholder('-')
        }
    }, [selectedValue, placeholder]);

    return (
        <input data-testid='unitInput' style={style} placeholder={_placeholder} value={value}
            onBlur={e => _onBlur(parseValue(e.target.value))}
            onFocus={e => setValue(parseValue(e.target.value))}
            onChange={onChange} title={title} />
    )
}