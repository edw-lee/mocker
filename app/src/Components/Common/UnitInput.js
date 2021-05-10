import { useEffect, useState } from "react";

const unitArr = ['cm', 'mm', 'in', 'px', 'pt', 'pc', 'em', 'ex', 'ch', 'rem', 'vw', 'vh', 'vmin', 'vmax', '%'];
const defaultUnit = 'px';
/**
 * @param {string} value 
 */
function parseValue(value) {
    let val = Number.parseFloat(value);

    if (!value.length || Number.isNaN(val))
        return '';

    val = val.toString();
    let unit = value.substring(val.length, value.length);

    if (!unit || !unitArr.includes(unit))
        unit = defaultUnit;

    return `${val}${unit}`;
}

export default function UnitInput({ style, placeholder, selectedValue, onValueChanged, title }) {
    const [value, setValue] = useState(parseValue(selectedValue));
    const [_placeholder, setPlaceholder] = useState(placeholder);

    const onChange = e => {
        setValue(e.target.value);
    }

    const onBlur = val => {
        if (onValueChanged && typeof (selectedValue) !== 'undefined')
            onValueChanged(val);
    }

    useEffect(_ => {
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
        <input style={style} placeholder={_placeholder} value={value}
            onBlur={e => onBlur(parseValue(e.target.value))}
            onFocus={e => setValue(parseValue(e.target.value))}
            onChange={onChange} title={title} />
    )
}