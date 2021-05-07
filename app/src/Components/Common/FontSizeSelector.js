import UndefinedSelector from "./UndefinedSelector";

const fontSizeVals = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 26, 28, 32, 36, 40, 44, 48, 54, 60, 66, 72, 88, 96];
const fontSizeOpts = fontSizeVals.map(fontSize => <option key={`fontSize${fontSize}`} value={`${fontSize}px`}>{fontSize} pt</option>)

export default function FontSizeSelector({ className, onChange, selectedFontSize }) {
    return (
        <UndefinedSelector className={className} onChange={onChange} selectedValue={selectedFontSize} defaultValue={''}>
            {fontSizeOpts}
        </UndefinedSelector>
    );
}