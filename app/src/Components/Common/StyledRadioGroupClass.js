import React from 'react';
import './css/StyledRadioButtonGroup.scss'

export class StyledRadioGroupClass extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            option: props.checkedValue
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.checkedValue !== this.props.checkedValue)
            this.setState({ option: this.props.checkedValue });
    }

    getOption() {
        return this.state.option;
    }

    render() {
        return <StyledRadioGroup labels={this.props.labels} values={this.props.values} checkedValue={this.state.option}
            onChange={e => {
                this.setState({ option: e.target.value });

                if (this.props.onChange)
                    this.props.onChange(e);
            }} />
    }
}

/**
 * @param {{labels:string[], values:string[], checkedValue:string, onChange:React.ChangeEvent=>any, name:string}} props 
 */
function StyledRadioGroup({ labels, values, checkedValue, onChange, name }) {

    const radioButtons = labels.map((label, idx) => {
        const id = `rb-${name}-${label}`;
        const value = values ? values[idx] : label;
        const checked = value === checkedValue;
        return (
            <span key={id} className='styled-rb'>
                <input type='radio' id={id} name={name} value={value} checked={checked} onChange={e => onChange(e)} />
                <label htmlFor={id}>{label}</label>
            </span>
        )
    });

    return (
        <div className='styled-rb-grp' >
            { radioButtons}
        </div>
    );
}