export default function UndefinedSelector({ testId, className, onChange, selectedValue, defaultValue = '', noDefault, children }) {
    if (typeof (selectedValue) === 'undefined')
        selectedValue = 'undefined';

    if(!onChange)
        onChange = ()=>{};

    return (
        <select data-testid={testId} className={className}
            onChange={onChange}
            value={selectedValue}>
            {selectedValue === 'undefined' && <option value={'undefined'}></option>}
            {!noDefault && <option value={defaultValue}>Default</option>}
            {children}
        </select>
    )
}