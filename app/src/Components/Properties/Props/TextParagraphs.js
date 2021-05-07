import React from 'react';
import PropsBox from '../PropsBox';
import FontSelector from '../../Common/FontSelector'
import FontSizeSelector from '../../Common/FontSizeSelector';
import { createStyleObj, createTextDecoObj } from '../CommonPropReturns';
import { getFontFamily, getStyle, getTextAlign, getTextDeco } from '../CommonPropGetters';
import ColorToggleButton from '../../Common/ColorToggleButton';

export default function TextParagraphsClass({ updateObjectsProps, getSelectedCommonProp }) {

    const changeFontFamily = fontFamily => {
        updateObjectsProps(_ => createStyleObj('fontFamily', fontFamily));
    }

    const changeFontSize = fontSize => {
        updateObjectsProps(_ => createStyleObj('fontSize', fontSize));
    }

    const changeTextAlign = textAlign => {
        updateObjectsProps(_ => createStyleObj('textAlign', textAlign));
    }

    const isItalic = getSelectedCommonProp(obj => getStyle(obj, 'fontStyle')) === 'italic';
    const isUnderlined = getSelectedCommonProp(obj => getTextDeco(obj, 'underline')) === 'underline';
    const isStrikeThrough = getSelectedCommonProp(obj => getTextDeco(obj, 'line-through')) === 'line-through';    
    const isBold = getSelectedCommonProp(obj => getStyle(obj, 'fontWeight')) === 'bold';

    const changeTextDeco = textDeco => {
        updateObjectsProps(obj => {
            return createTextDecoObj(textDeco, { ...obj.props.style }, isBold, isItalic, isUnderlined, isStrikeThrough);
        });
    }
    
    const textAlign = getSelectedCommonProp(getTextAlign);

    let selectedFontFamily = getSelectedCommonProp(getFontFamily);

    let selectedFontSize = getSelectedCommonProp(obj => getStyle(obj, 'fontSize'));

    return (
        <PropsBox title='Text & Paragraphs'>
            <div className='props-row'>
                <FontSelector className='props-selector props-grow props-margin-right'
                    onChange={e => changeFontFamily(e.target.value)} selectedFontFamily={selectedFontFamily} />

                <FontSizeSelector className='props-selector' onChange={e => changeFontSize(e.target.value)}
                    selectedFontSize={selectedFontSize} />
            </div>

            <div className='props-row'>
                <div className='props-btn-grp'>
                    <ColorToggleButton onClick={_ => changeTextDeco('bold')}  toggleState={isBold}>
                        <i className='fas fa-bold'></i>
                    </ColorToggleButton>

                    <ColorToggleButton onClick={_ => changeTextDeco('italic')} toggleState={isItalic}>
                        <i className='fas fa-italic'></i>
                    </ColorToggleButton>

                    <ColorToggleButton onClick={_ => changeTextDeco('underline')} toggleState={isUnderlined}>
                        <i className='fas fa-underline'></i>
                    </ColorToggleButton>

                    <ColorToggleButton onClick={_ => changeTextDeco('line-through')} toggleState={isStrikeThrough}>
                        <i className='fas fa-strikethrough'></i>
                    </ColorToggleButton>
                </div>

                <div className='props-btn-grp'>
                    <ColorToggleButton onClick={_ => changeTextAlign('left')} toggleState={textAlign === 'left'}>
                        <i className='fas fa-align-left'></i>
                    </ColorToggleButton>

                    <ColorToggleButton onClick={_ => changeTextAlign('center')} toggleState={textAlign === 'center'}>
                        <i className='fas fa-align-center'></i>
                    </ColorToggleButton>

                    <ColorToggleButton onClick={_ => changeTextAlign('right')} toggleState={textAlign === 'right'}>
                        <i className='fas fa-align-right'></i>
                    </ColorToggleButton>

                    <ColorToggleButton onClick={_ => changeTextAlign('justify')} toggleState={textAlign === 'justify'}>
                        <i className='fas fa-align-justify'></i>
                    </ColorToggleButton>
                </div>
            </div>

        </PropsBox>
    );
}