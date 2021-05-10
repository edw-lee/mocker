import { useEffect, useRef, useState } from 'react';
import './css/BorderStyleSelector.scss'

const borderStyleArr = ['', 'none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset'];

export default function BorderStyleSelector({ selectedBorderStyle, onBorderStyleChanged }) {
    const selectorRef = useRef();
    const selectorOptionsRef = useRef();

    const [borderStyle, setBorderStyle] = useState(selectedBorderStyle);
    const [hoveredStyle, setHoveredStyle] = useState(selectedBorderStyle);
    const [topOffset, setTopOffset] = useState(0);
    const [opacity, setOpacity] = useState(0);
    const [display, setDisplay] = useState('');
    let optRectHeight = useRef();


    useEffect(_ => {
        //Calculate the top offset of the options rect
        //This has to be calculated whenever the selectedBorderStyle changes because that includes when the selected object changes
        const selectorOptions = selectorOptionsRef.current;
        const selectorOptRect = selectorOptions.getBoundingClientRect();

        if(selectorOptRect.height > 0)
            optRectHeight.current = selectorOptRect.height;           
    }, []);

    useEffect(_ => {
        setBorderStyle(selectedBorderStyle);
        setHoveredStyle(selectedBorderStyle);         
        
        const selector = selectorRef.current;
        const selectorRect = selector.getBoundingClientRect();
        //If the selector rect position is truncatd at the bottom of the window,
        //Offset the selector rect so that it appear at the top
        if (selectorRect.y + optRectHeight.current >= window.innerHeight)
            setTopOffset(`${-optRectHeight.current}px`);
        else
            setTopOffset('');

        //Set display to none after the offset has been calculated
        //If not, the offset will be 0        
        setOpacity(0);
        setDisplay('none');
    }, [selectedBorderStyle]);
    
    
    const toggleOpacity = _ => {
        const isShow = opacity === 1;
        setOpacity(isShow ? 0 : 1);
        setDisplay(isShow ? 'none' : '');
    }

    const selectBorder = borderStyle => {
        if (onBorderStyleChanged)
            onBorderStyleChanged(borderStyle);

        setBorderStyle(borderStyle);        
    }

    window.onclick = e => {
        if (e.target !== selectorRef.current)
            setOpacity(0);
    }

    const borderStylesOpts = borderStyleArr.map(_borderStyle => {
        const className = _borderStyle === hoveredStyle ? 'selected' : '';
        return (
            <div className={className}
                onMouseOver={_ => setHoveredStyle(_borderStyle)}
                onClick={_ => selectBorder(_borderStyle)}
                title={_borderStyle}
                key={_borderStyle}>
                <div style={{ borderStyle: _borderStyle }}>
                    {!_borderStyle ? <label>Default</label> :
                        _borderStyle === 'none' ? <label>No Border</label> : ''}
                </div>
            </div>
        );
    });


    return (
        <div className='borderstyle-selector'>
            <div className='borderstyle-optbtn' onClick={toggleOpacity} ref={selectorRef}>
                <div style={{ borderStyle }}>
                    {borderStyle === '' ? <span>{borderStyle !== undefined && 'Default'}</span> :
                        borderStyle === 'none' ? <span>No border</span> : ''
                    }
                </div>
                <i className='fas fa-chevron-down'></i>
            </div>
            <div className={`borderstyle-options`}
                style={{ top: topOffset, display, opacity }}
                ref={selectorOptionsRef}>
                {borderStyle === undefined &&
                    <div
                        className={hoveredStyle === undefined ? 'selected' : ''}
                        onMouseOver={_ => setHoveredStyle(undefined)}
                        key={'undefined'}>
                        <div style={{ padding: '5px' }}></div>
                    </div>
                }
                {borderStylesOpts}
            </div>
        </div>
    )
}