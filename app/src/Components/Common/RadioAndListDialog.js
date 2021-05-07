import React from 'react';
import { StyledRadioGroupClass } from "./StyledRadioGroupClass";

/**@type{React.CSSProperties}*/
const inputStyle = {
    marginBottom: '0.25rem',
    marginRight: '5px',
    flexGrow: '1'
}

/**@type{React.CSSProperties}*/
const containerStyle = {
    display: 'flex',
    flexDirection: 'column'
}

export class RadioAndListDialog extends React.Component {
    radioRef = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            items: props.items ? props.items : [],
            newItem: '',
        }
    }

    addItem(item) {
        const items = [...this.state.items, item];
        this.setState({ newItem: '', items });
    }

    removeItem(idx) {
        const items = this.state.items.filter((item, _idx) => _idx !== idx);
        this.setState({ items });
    }

    onBlur(e, idx) {
        if (e.target.value.length === 0)
            this.removeItem(idx);
    }

    updateItem(item, idx) {
        var { items } = this.state;
        items[idx] = item;
        this.setState({ items });
    }

    getItems() {
        var { items } = this.state;

        if (this.state.newItem)
            items.push(this.state.newItem);

        return items;
    }

    clearNewItem() {
        this.setState({ newItem: '' });
    }

    getOption() {
        return this.radioRef.current.getOption();
    }

    render() {
        const { newItem } = this.state;

        var inputs = this.state.items.map((item, idx) => {
            return (
                <div key={`div-${idx}`} style={{ display: 'flex' }}>
                    <input style={inputStyle} value={item} onChange={e => this.updateItem(e.target.value, idx)} onBlur={e => this.onBlur(e, idx)} />
                    <button className='icon-btn'
                        onClick={_ => { this.removeItem(idx) }}>
                        <i className='fas fa-times'></i>
                    </button>
                </div>
            )
        });

        return (
            <div style={containerStyle}>
                {this.props.labels && this.props.labels.length > 1 &&
                    <StyledRadioGroupClass ref={this.radioRef} labels={this.props.labels} values={this.props.values} name='radiolist-option'
                        checkedValue={this.props.checkedValue} />}

                {inputs}

                <input style={inputStyle} autoFocus={true} placeholder={this.props.placeholder} value={newItem}
                    onChange={(e) => this.setState({ newItem: e.target.value })} />

                {<i className={`fas fa-plus-circle plus-btn ${!newItem ? 'disabled' : ''}`}
                    onClick={() => {
                        if (newItem)
                            this.addItem(newItem)
                    }}></i>}
            </div>
        );
    }
}