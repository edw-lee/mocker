import { useState } from "react"

export default function IconToggleButton({onClick, toggleState, children}) {
    const [_toggleState, setToggleState] = useState(toggleState);

    const _onClick = () => {
        if(onClick)
            onClick();
        
        setToggleState(!_toggleState);
    }

    return (
        <button data-testid='iconToggleBtn' onClick={_onClick} className={`icon-btn toggle ${_toggleState ? 'on' : 'off'}`}>
            {children}
        </button>
    )
}