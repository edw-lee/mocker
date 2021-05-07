import React from 'react';

const maxLength = 2, maxCols = 20, minValue = 1;

const inputStyle = {
    width: '3rem',
}

export default class CreateGridLayoutDialog extends React.Component {
    state = {
        noOfCols: 1,
        colGap: 10, //px
        rowGap: 10 //px
    }

    get noOfCols() {
        return this.state.noOfCols;
    }

    get colGap() {
        return this.state.colGap;
    }

    get rowGap() {
        return this.state.rowGap;
    }

    render() {
        const { noOfCols, colGap, rowGap } = this.state;
        return (
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    <h4 style={{ margin: '0.5rem 0' }}>Number of Columns &nbsp;</h4>
                    <input type='number' style={{ textAlign: 'right', width: '4rem' }} value={noOfCols} onChange={e => this.setState({ noOfCols: e.target.value })}
                        maxLength={maxLength} max={maxCols} min={minValue} />
                </span>

                <h4 style={{ marginTop: '0', marginBottom: '0.25rem' }}>Spacings</h4>
                <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-around' }}>
                    <div style={{ marginRight: '0.5rem' }}>
                        <div style={{ margin: '0.25rem 0' }}>Column</div>
                        <input type='number' style={inputStyle} value={colGap} onChange={e => this.setState({ colGap: e.target.value })} maxLength={maxLength} min={minValue} />
                        <label>&nbsp;px</label>
                    </div>

                    <div>
                        <div style={{ margin: '0.25rem 0' }}>Row</div>
                        <input type='number' style={inputStyle} value={rowGap} onChange={e => this.setState({ rowGap: e.target.value })} maxLength={maxLength} min={minValue} />
                        <label>&nbsp;px</label>
                    </div>
                </div>
            </span>
        );
    }
}