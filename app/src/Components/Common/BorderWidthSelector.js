import UndefinedSelector from "./UndefinedSelector";

const borderWidthArr = ['thin', 'medium', 'thick'];
const minWidthPx = 1;
const maxWidthPx = 20;

export default function BorderWidthSelector({selectedWidth, onChange}) {
    let borderWidthOptions = borderWidthArr.map(borderWidth => <option key={borderWidth}>{borderWidth}</option>)
    
    for (var i = minWidthPx; i <= maxWidthPx; i++) {
        const width = `${i}px`;
        borderWidthOptions.push(<option key={width}>{width}</option>);
    }

    return (
        <UndefinedSelector selectedValue={selectedWidth} onChange={e => onChange(e.target.value)}>
            {borderWidthOptions}
        </UndefinedSelector>
    );
}