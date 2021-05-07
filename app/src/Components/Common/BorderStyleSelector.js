import { useEffect, useRef, useState } from 'react';
import './css/BorderStyleSelector.scss'

const borderStyleArr = ['', 'none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset'];

export default function BorderStyleSelector({ selectedBorderStyle, onBorderStyleChanged }) {
    const selectorRef = useRef();
    const selectorOptionsRef = useRef();

    const [show, setShow] = useState('');
    const [borderStyle, setBorderStyle] = useState(selectedBorderStyle);
    const [hoveredStyle, setHoveredStyle] = useState(selectedBorderStyle);
    const [topOffset, setTopOffset] = useState(0);
    const [opacity, setOpacity] = useState(0);

    const toggleShow = _ => {
        setShow(!show ? 'show' : '');
    }

    const selectBorder = borderStyle => {
        setBorderStyle(borderStyle);
        setShow('');
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

    useEffect(_ => {
        setBorderStyle(selectedBorderStyle);
        setHoveredStyle(selectedBorderStyle);
    }, [selectedBorderStyle])

    useEffect(_ => {
        if (borderStyle !== undefined) {
            if (onBorderStyleChanged)
                onBorderStyleChanged(borderStyle);
        }
    }, [borderStyle])

    useEffect(_ => {
        const selectorOptions = selectorOptionsRef.current;
        const selectorOptRect = selectorOptions.getBoundingClientRect();

        const offset = `${-selectorOptRect.height}px`;
        if (selectorOptRect.y + selectorOptRect.height >= window.innerHeight && topOffset !== offset)
            setTopOffset(offset);
        else if (topOffset !== '')
            setTopOffset('');

        if (show)
            setOpacity(1);
        else
            setOpacity(0);

    }, [show]);

    window.onclick = e => {
        if (e.target !== selectorRef.current)
            setShow('');
    }

    return (
        <div className='borderstyle-selector'>
            <div className='borderstyle-optbtn' onClick={toggleShow} ref={selectorRef}>
                <div style={{ borderStyle }}>
                    {borderStyle === '' ? <span>{borderStyle !== undefined && 'Default'}</span> :
                        borderStyle === 'none' ? <span>No border</span> : ''
                    }
                </div>
                <i className='fas fa-chevron-down'></i>
            </div>
            <div className={`borderstyle-options`}
                style={{ top: topOffset, display: show ? 'block' : '', opacity }}
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