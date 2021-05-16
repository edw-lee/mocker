import React from 'react';
import StyledRadioGroup from "./StyledRadioGroup";

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

export default class RadioAndListDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: props.items ? props.items : [],
            newItem: '',
            radioValue: props.checkedValue
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

    getRadioValue() {
        return this.state.radioValue;
    }

    render() {
        const { newItem } = this.state;
        const { labels, values, placeholder, checkedValue } = this.props;

        var inputs = this.state.items.map((item, idx) => {
            return (
                <div key={`div-${idx}`} style={{ display: 'flex' }}>
                    <input style={inputStyle} value={item} onChange={e => this.updateItem(e.target.value, idx)} onBlur={e => this.onBlur(e, idx)} />
                    <button className='icon-btn'
                        onClick={() => { this.removeItem(idx) }}>
                        <i className='fas fa-times'></i>
                    </button>
                </div>
            )
        });

        return (
            <div data-testid='radioAndListDialog' style={containerStyle}>
                {labels && labels.length > 1 &&
                    <StyledRadioGroup ref={this.radioRef} labels={labels} values={values} name='radiolist-option'
                        checkedValue={checkedValue} onChange={e => this.setState({ radioValue: e.target.value })} />}

                {inputs}

                <input data-testid='radioAndListDialog-Input' style={inputStyle} autoFocus={true} placeholder={placeholder} value={newItem}
                    onChange={(e) => this.setState({ newItem: e.target.value })} />

                {<i data-testid='radioAndListDialog-AddBtn' className={`fas fa-plus-circle plus-btn ${!newItem ? 'disabled' : ''}`}
                    onClick={() => {
                        if (newItem)
                            this.addItem(newItem)
                    }}></i>}
            </div>
        );
    }
}