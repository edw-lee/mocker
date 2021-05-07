export default function ColorPicker({ value='#000000', onChange }) {
    const clearColor = _ => {
        onChange('');
    }

    return (
        <span>
            <input type='color' value={value} onChange={e => onChange(e.target.value)}
                style={{ width: '20px', borderRadius: '2px', padding: '0 1px', marginRight: '5px' }} />
            <button className='icon-btn' onClick={clearColor}>
                <i className='fas fa-times'></i>
            </button>
        </span>
    )
}