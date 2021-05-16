import React, { useEffect, useState } from 'react';
import BorderStyleSelector from '../../Common/BorderStyleSelector';
import BorderWidthSelector from '../../Common/BorderWidthSelector';
import ColorPicker from '../../Common/ColorPicker';
import PropsBox from '../PropsBox';
import { getStyle } from '../CommonPropGetters';
import { createStyleObj } from '../CommonPropReturns';


export default function Styles({ updateObjectsProps, getSelectedCommonProp }) {
    const selectedBorderStyle = getSelectedCommonProp(obj => getStyle(obj, 'borderStyle'));
    const selectedBorderWidth = getSelectedCommonProp(obj => getStyle(obj, 'borderWidth'));
    const selectedBorderColor = getSelectedCommonProp(obj => getStyle(obj, 'borderColor', '#000000'))
    const selectedOpacity = getSelectedCommonProp(obj => getStyle(obj, 'opacity', 1));
    const selectedColor = getSelectedCommonProp(obj => getStyle(obj, 'color', '#000000'));
    const selectedBgcolor = getSelectedCommonProp(obj => getStyle(obj, 'backgroundColor', '#000000'));

    const [opacity, setOpacity] = useState(selectedOpacity * 100);

    const changeStyle = (styleProp, oldValue, newValue) => {
        if (oldValue === newValue) return;

        updateObjectsProps(()=> createStyleObj(styleProp, newValue));
    }

    const changeOpacity = opacity => {
        opacity = Math.min(Math.max(0, opacity), 100).toString().trim('0');

        updateObjectsProps(()=> createStyleObj('opacity', opacity / 100.0));

        setOpacity(opacity);
    }

    useEffect(()=> {
        if (selectedOpacity !== undefined)
            setOpacity(selectedOpacity * 100)
    }, [selectedOpacity]);

    return (
        <PropsBox title='Styles'>
            <div className='props-row props-space-between'>
                <label>Border</label>

                <BorderStyleSelector selectedBorderStyle={selectedBorderStyle}
                    onBorderStyleChanged={borderStyle => changeStyle('borderStyle', selectedBorderStyle, borderStyle)} />

                <ColorPicker value={selectedBorderColor} onChange={value => changeStyle('borderColor', selectedBorderColor, value)} />

                <BorderWidthSelector selectedWidth={selectedBorderWidth}
                    onChange={borderWidth => changeStyle('borderWidth', selectedBorderWidth, borderWidth)} />
            </div>

            <div className='props-row props-space-between'>
                <label>Color</label>

                <ColorPicker value={selectedColor} onChange={value => changeStyle('color', selectedColor, value)} />

                <label>Background</label>

                <ColorPicker value={selectedBgcolor} onChange={value => changeStyle('backgroundColor', selectedBgcolor, value)} />
            </div>

            <div className='props-row'>
                <label>Opacity</label>
                <span>
                    <input type='number' style={{ width: '3rem', textAlign: 'right' }}
                        value={opacity} min='0' max='100' onChange={e => changeOpacity(e.target.value)} />
                    <label> %</label>
                </span>
            </div>
        </PropsBox>
    );
}