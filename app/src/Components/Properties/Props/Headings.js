import React from 'react';
import PropsBox from '../PropsBox';
import FontSelector from '../../Common/FontSelector'
import { StyledRadioGroupClass } from '../../Common/StyledRadioGroupClass';
import { createTextDecoObj, createTypeObj, createStyleObj } from '../CommonPropReturns';
import { getTextAlign, getTextDeco, getStyle } from '../CommonPropGetters';
import ColorToggleButton from '../../Common/ColorToggleButton';

export default function HeadingStyles({ updateObjectsProps, getSelectedCommonProp }) {
    const changeHeadingLevel = type => {
        updateObjectsProps(_ => createTypeObj(type));
    }

    const changeFontFamily = fontFamily => {
        updateObjectsProps(_ => createStyleObj('fontFamily', fontFamily));
    }

    const changeTextAlign = textAlign => {
        updateObjectsProps(_ => createStyleObj('textAlign', textAlign));
    }

    const textAlign = getSelectedCommonProp(getTextAlign);

    const isItalic = getSelectedCommonProp(obj => getStyle(obj, 'fontStyle')) === 'italic';
    const isUnderlined = getSelectedCommonProp(obj => getTextDeco(obj, 'underline')) === 'underline';
    const isStrikeThrough = getSelectedCommonProp(obj => getTextDeco(obj, 'line-through')) === 'line-through';

    //TODO: Change selected text only, if there is a selection
    const changeTextDeco = textDeco => {
        updateObjectsProps(obj => {
            return createTextDecoObj(textDeco, { ...obj.props.style }, false, isItalic, isUnderlined, isStrikeThrough);
        });
    }

    const selectedHeading = getSelectedCommonProp(obj => obj.type);

    let selectedFontFamily = getSelectedCommonProp(obj => getStyle(obj, 'fontFamily'));

    if (typeof (selectedFontFamily) === 'undefined')
        selectedFontFamily = 'undefined';

    return (
        <PropsBox title='Headings'>
            <StyledRadioGroupClass labels={['H1', 'H2', 'H3', 'H4', 'H5', 'H6']} values={['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}
                onChange={e => changeHeadingLevel(e.target.value)} checkedValue={selectedHeading} />

            <div className='props-row'>
                <FontSelector className='props-selector props-grow props-margin-right'
                    onChange={e => changeFontFamily(e.target.value)} selectedFontFamily={selectedFontFamily} />
            </div>

            <div className='props-row'>
                <div className='props-btn-grp'>
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