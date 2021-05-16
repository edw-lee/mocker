import React from 'react';
import PropsBox from '../PropsBox';
import FontSelector from '../../Common/FontSelector'
import StyledRadioGroup from '../../Common/StyledRadioGroup';
import { createTextDecoObj, createTypeObj, createStyleObj } from '../CommonPropReturns';
import { getTextAlign, getTextDeco, getStyle } from '../CommonPropGetters';
import IconToggleButton from '../../Common/IconToggleButton';

export default function HeadingStyles({ updateObjectsProps, getSelectedCommonProp }) {
    const changeHeadingLevel = type => {
        updateObjectsProps(()=> createTypeObj(type));
    }

    const changeFontFamily = fontFamily => {
        updateObjectsProps(()=> createStyleObj('fontFamily', fontFamily));
    }

    const changeTextAlign = textAlign => {
        updateObjectsProps(()=> createStyleObj('textAlign', textAlign));
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
            <StyledRadioGroup labels={['H1', 'H2', 'H3', 'H4', 'H5', 'H6']} values={['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}
                onChange={e => changeHeadingLevel(e.target.value)} checkedValue={selectedHeading} />

            <div className='props-row'>
                <FontSelector className='props-selector props-grow props-margin-right'
                    onChange={e => changeFontFamily(e.target.value)} selectedFontFamily={selectedFontFamily} />
            </div>

            <div className='props-row'>
                <div className='props-btn-grp'>
                    <IconToggleButton onClick={()=> changeTextDeco('italic')} toggleState={isItalic}>
                        <i className='fas fa-italic'></i>
                    </IconToggleButton>

                    <IconToggleButton onClick={()=> changeTextDeco('underline')} toggleState={isUnderlined}>
                        <i className='fas fa-underline'></i>
                    </IconToggleButton>

                    <IconToggleButton onClick={()=> changeTextDeco('line-through')} toggleState={isStrikeThrough}>
                        <i className='fas fa-strikethrough'></i>
                    </IconToggleButton>
                </div>

                <div className='props-btn-grp'>
                    <IconToggleButton onClick={()=> changeTextAlign('left')} toggleState={textAlign === 'left'}>
                        <i className='fas fa-align-left'></i>
                    </IconToggleButton>

                    <IconToggleButton onClick={()=> changeTextAlign('center')} toggleState={textAlign === 'center'}>
                        <i className='fas fa-align-center'></i>
                    </IconToggleButton>

                    <IconToggleButton onClick={()=> changeTextAlign('right')} toggleState={textAlign === 'right'}>
                        <i className='fas fa-align-right'></i>
                    </IconToggleButton>

                    <IconToggleButton onClick={()=> changeTextAlign('justify')} toggleState={textAlign === 'justify'}>
                        <i className='fas fa-align-justify'></i>
                    </IconToggleButton>
                </div>
            </div>

        </PropsBox>
    );
}