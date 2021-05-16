import UndefinedSelector from "./UndefinedSelector";

export const positions = ['static', 'relative', 'fixed', 'absolute', 'sticky'];
const positionOpts = positions.map(pos => <option key={pos}>{pos}</option>)

export default function PositionSelector({ className, onChange, selectedValue }) {
    return (
        <UndefinedSelector testId='positionSelector' className={className}
            onChange={onChange}
            selectedValue={selectedValue}>
            {positionOpts}
        </UndefinedSelector>
    );
}