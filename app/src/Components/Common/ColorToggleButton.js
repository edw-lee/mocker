export default function ColorToggleButton({onClick, toggleState, children}) {
    return (
        <button onClick={onClick} className={`icon-btn toggle ${toggleState ? 'on' : 'off'}`}>
            {children}
        </button>
    )
}