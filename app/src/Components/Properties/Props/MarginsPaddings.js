import React from 'react';
import PropsBox from '../PropsBox';
import UnitInput from '../../Common/UnitInput';
import { getStyle } from '../CommonPropGetters';
import { createStyleObj } from '../CommonPropReturns';

/**@type{React.CSSProperties} */
const inputStyle = {
    width: '3rem',
    textAlign: 'center'
}

/**@type{React.CSSProperties} */
const marginBoxStyle = {
    padding: '0.35rem',
    background: 'var(--secondary)'
}

/**@type{React.CSSProperties} */
const paddingBoxStyle = {
    padding: '1rem',
    background: 'var(--secondary-l)'
}

function InputBox({ selectedValue, onBlur, title }) {
    return <UnitInput title={title} selectedValue={selectedValue} onBlur={onBlur}
        style={inputStyle} placeholder='auto' />
}

export default function MarginsPaddings({ updateObjectsProps, getSelectedCommonProp }) {
    const selectedPadTop = getSelectedCommonProp(obj => getStyle(obj, 'paddingTop', ''));
    const selectedPadLeft = getSelectedCommonProp(obj => getStyle(obj, 'paddingLeft', ''));
    const selectedPadBottom = getSelectedCommonProp(obj => getStyle(obj, 'paddingBottom', ''));
    const selectedPadRight = getSelectedCommonProp(obj => getStyle(obj, 'paddingRight', ''));

    const selectedMarginTop = getSelectedCommonProp(obj => getStyle(obj, 'marginTop', ''));
    const selectedMarginLeft = getSelectedCommonProp(obj => getStyle(obj, 'marginLeft', ''));
    const selectedMarginBottom = getSelectedCommonProp(obj => getStyle(obj, 'marginBottom', ''));
    const selectedMarginRight = getSelectedCommonProp(obj => getStyle(obj, 'marginRight', ''));

    const changeMarginPadding = (styleProp, oldValue, newValue) => {
        if(oldValue === newValue) return;

        updateObjectsProps(()=> createStyleObj(styleProp, newValue));
    }

    return (
        <PropsBox title='Margins & Paddings'>
            <div title='Margin Area'>
                <div className='props-row props-no-margin'>
                    <InputBox selectedValue={selectedMarginTop} title='Top Margin'
                        onBlur={marginTop => changeMarginPadding('marginTop', selectedMarginTop, marginTop)} />
                </div>

                <div className='props-row'>
                    <InputBox selectedValue={selectedMarginLeft} title='Left Margin'
                        onBlur={marginLeft => changeMarginPadding('marginLeft', selectedMarginLeft, marginLeft)} />

                    <div style={marginBoxStyle} title='Padding Area'>
                        <div className='props-row'>
                            <InputBox selectedValue={selectedPadTop} title='Top Padding'
                                onBlur={paddingTop => changeMarginPadding('paddingTop', selectedPadTop, paddingTop)} />
                        </div>

                        <div className='props-row'>
                            <InputBox selectedValue={selectedPadLeft} title='Left Padding'
                                onBlur={paddingLeft => changeMarginPadding('paddingLeft', selectedPadLeft, paddingLeft)} />

                            <div style={paddingBoxStyle} title='Object'>
                            </div>

                            <InputBox selectedValue={selectedPadRight} title='Right Padding'
                                onBlur={paddingRight => changeMarginPadding('paddingRight', selectedPadRight, paddingRight)} />
                        </div>

                        <div className='props-row'>
                            <InputBox selectedValue={selectedPadBottom} title='Bottom Padding'
                                onBlur={paddingBottom => changeMarginPadding('paddingBottom', selectedPadBottom, paddingBottom)} />
                        </div>
                    </div>

                    <InputBox selectedValue={selectedMarginRight} title='Right Margin'
                        onBlur={marginRight => changeMarginPadding('marginRight', selectedMarginRight, marginRight)} />
                </div>

                <div className='props-row'>
                    <InputBox selectedValue={selectedMarginBottom} title='Bottom Margin'
                        onBlur={marginBottom => changeMarginPadding('marginBottom', selectedMarginBottom, marginBottom)} />
                </div>
            </div>

        </PropsBox >
    );
}