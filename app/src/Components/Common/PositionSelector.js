import UndefinedSelector from "./UndefinedSelector";

const positions = ['static', 'relative', 'fixed', 'absolute', 'sticky'];
const positionOpts = positions.map(pos => <option key={pos}>{pos}</option>)

export default function PositionSelector({ className, onChange, selectedValue }) {
    return (
        <UndefinedSelector className={className}
            onChange={onChange}
            selectedValue={selectedValue}>
            {positionOpts}
        </UndefinedSelector>
    );
}