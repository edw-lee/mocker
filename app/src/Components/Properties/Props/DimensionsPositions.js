import React from 'react';
import PositionSelector from '../../Common/PositionSelector';
import PropsBox from '../PropsBox';
import UnitInput from '../../Common/UnitInput';
import { getStyle } from '../CommonPropGetters';
import { createStyleObj } from '../CommonPropReturns';

export default function DimensionsPositions({ updateObjectsProps, getSelectedCommonProp }) {
    const selectedPosition = getSelectedCommonProp(obj => getStyle(obj, 'position'));

    const selectedWidth = getSelectedCommonProp(obj => getStyle(obj, 'width', ''));
    const selectedHeight = getSelectedCommonProp(obj => getStyle(obj, 'height', ''));
    const selectedTop = getSelectedCommonProp(obj => getStyle(obj, 'top', ''));
    const selectedRight = getSelectedCommonProp(obj => getStyle(obj, 'right', ''));
    const selectedBottom = getSelectedCommonProp(obj => getStyle(obj, 'bottom', ''));
    const selectedLeft = getSelectedCommonProp(obj => getStyle(obj, 'left', ''));
    const selectedZIndex = getSelectedCommonProp(obj => getStyle(obj, 'z-index', ''));        

    const changeDimPos = (styleProp, oldValue, newValue) => { 
        if(oldValue === newValue) return;

        updateObjectsProps(()=> createStyleObj(styleProp, newValue));
    }

    return (
        <PropsBox title='Dimensions & Positions'>
            <div className='props-row'>
                <PositionSelector className='props-selector props-grow'
                    onChange={e => changeDimPos('position', selectedPosition, e.target.value)} selectedValue={selectedPosition} />
            </div>

            <div className='props-row'>
                <div className='props-input-grp-col'>
                    <label>Width</label>
                    <UnitInput style={{ width: '4rem' }} selectedValue={selectedWidth} placeholder='auto'
                        onValueChanged={width => changeDimPos('width', selectedWidth, width)} />
                </div>

                <div>
                    <div>&nbsp;</div>
                    <i className='fas fa-times'></i>
                </div>

                <div className='props-input-grp-col'>
                    <label>Height</label>
                    <UnitInput style={{ width: '3rem' }} selectedValue={selectedHeight} placeholder='auto'
                        onValueChanged={height => changeDimPos('height', selectedHeight, height)} />
                </div>
            </div>

            <div className='props-row'>
                <div className='props-input-grp-col'>
                    <label>Top</label>
                    <UnitInput style={{ width: '3rem' }} selectedValue={selectedTop} placeholder='auto'
                        onValueChanged={top => changeDimPos('top', selectedTop, top)} />                    
                </div>

                <div className='props-input-grp-col'>
                    <label>Right</label>
                    <UnitInput style={{ width: '3rem' }} selectedValue={selectedRight} placeholder='auto'
                        onValueChanged={right => changeDimPos('right', selectedRight, right)} />
                </div>


                <div className='props-input-grp-col'>
                    <label>Bottom</label>
                    <UnitInput style={{ width: '3rem' }} selectedValue={selectedBottom} placeholder='auto'
                        onValueChanged={bottom => changeDimPos('bottom', selectedBottom, bottom)} />                    
                </div>

                <div className='props-input-grp-col'>
                    <label>Left</label>
                    <UnitInput style={{ width: '3rem' }} selectedValue={selectedLeft} placeholder='auto'
                        onValueChanged={left => changeDimPos('left', selectedLeft, left)} />                    
                </div>

                <div className='props-input-grp-col'>
                    <label>Z-Index</label>
                    <UnitInput style={{ width: '3rem' }} selectedValue={selectedZIndex} placeholder='auto'
                        onValueChanged={zindex => changeDimPos('zIndex', selectedZIndex, zindex)} />                    
                </div>
            </div>
        </PropsBox>
    );
}