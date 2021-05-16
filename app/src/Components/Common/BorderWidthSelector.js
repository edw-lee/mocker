import UndefinedSelector from "./UndefinedSelector";

export const BORDER_WIDTH_ARR = ['thin', 'medium', 'thick'];
const MIN_WIDTH_PX = 1;
const MAX_WIDTH_PX = 20;

for(let i = MIN_WIDTH_PX; i <= MAX_WIDTH_PX; i++)
    BORDER_WIDTH_ARR.push(`${i}px`);

export default function BorderWidthSelector({selectedWidth, onChange}) {
    let borderWidthOptions = BORDER_WIDTH_ARR.map(borderWidth => <option key={borderWidth}>{borderWidth}</option>)

    if(selectedWidth && selectedWidth.length && !BORDER_WIDTH_ARR.includes(selectedWidth))
        selectedWidth = undefined;

    return (
        <UndefinedSelector testId='borderWidthSelector' selectedValue={selectedWidth} onChange={e => onChange(e.target.value)}>
            {borderWidthOptions}
        </UndefinedSelector>
    );
}