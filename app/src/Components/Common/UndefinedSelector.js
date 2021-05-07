export default function UndefinedSelector({ className, onChange, selectedValue, defaultValue = '', noDefault, children }) {
    if (typeof (selectedValue) === 'undefined')
        selectedValue = 'undefined';

    return (
        <select className={className}
            onChange={onChange}
            value={selectedValue}>
            {selectedValue === 'undefined' && <option value={'undefined'}></option>}
            {!noDefault && <option value={defaultValue}>Default</option>}
            {children}
        </select>
    )
}