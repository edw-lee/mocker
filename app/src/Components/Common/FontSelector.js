import fontFamilies from '../../Constants/font_families.json';
import UndefinedSelector from './UndefinedSelector'

const fontFamilyOpts = Object.keys(fontFamilies).map(fontFamily => {
    const value = fontFamilies[fontFamily];
    return <option key={fontFamily} value={value}
        style={{ fontFamily: fontFamilies[fontFamily] }}>
        {fontFamily}
    </option>
});

export default function FontSelector({ className, onChange, selectedFontFamily }) {
    return (
        <UndefinedSelector className={className} onChange={onChange} selectedValue={selectedFontFamily}
            defaultValue={''}>
            {fontFamilyOpts}
        </UndefinedSelector>
    )
}