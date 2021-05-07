import React from 'react';

/**@type{React.CSSProperties} */
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '0.5rem',
}
/**@type{React.CSSProperties} */
const innerDivStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem'
}
/**@type{React.CSSProperties} */
const checkboxSpanStyle = {
    display: 'flex',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none'
}
/**@type{React.CSSProperties} */
const inputLabelStyle = {
    marginLeft: '0.5rem'
}

/**@type{React.CSSProperties} */
const inputStyle = {
    width: '2rem',
    textAlign: 'right',
}

/**@type{React.CSSProperties} */
const timesStyle = {
    margin: '0 1rem',
    textAlign: 'center'
}

export default class CreateTableDialog extends React.Component {
    state = {
        rows: 3,
        cols: 3,
        hasHeader: false,
        hasFooter: false
    }

    getTableProps() {    
        return this.state;
    }

    render() {
        const { rows, cols, hasHeader, hasFooter } = this.state;

        return (
            <div style={containerStyle}>
                <div style={innerDivStyle}>
                    <input value={rows} onChange={e => this.setState({ rows: e.target.value })} style={inputStyle} maxLength={3} />
                    <label style={inputLabelStyle}>Row{rows > 1 && 's'}</label>

                    <i className='fas fa-times' style={timesStyle}></i>

                    <input value={cols} onChange={e => this.setState({ cols: e.target.value })} style={inputStyle} maxLength={3} />
                    <label style={inputLabelStyle}>Col{cols > 1 && 's'}</label>
                </div>

                <div style={innerDivStyle}>
                    <span style={checkboxSpanStyle}>
                        <input id='check-header' type='checkbox' style={inputStyle}
                            checked={hasHeader} onChange={e => this.setState({ hasHeader: e.target.checked })} />
                        <label htmlFor='check-header'>Header</label>
                    </span>

                    <span style={checkboxSpanStyle}>
                        <input id='check-footer' type='checkbox' style={inputStyle}
                            checked={hasFooter} onChange={e => this.setState({ hasFooter: e.target.checked })} />
                        <label htmlFor='check-footer'>Footer</label>
                    </span>
                </div>
            </div>
        );
    }
}