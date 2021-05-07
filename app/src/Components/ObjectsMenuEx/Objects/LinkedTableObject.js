import React from 'react';
import * as GoogleSheetManager from '../../../Managers/GoogleAPIs/GoogleSheet'
import { getRandom64 } from '../../../Functions/Common';

//TODO: Add a refresh button so that user can refesh the table
export default class LinkedTableObject extends React.Component {

    state = {
        headerCols: [],
        rows: [],
    }

    //TODO: Maybe add a feature that allow users to set refresh rate interval
    componentDidMount() {
        const { sheetId } = this.props;

        GoogleSheetManager.getSheet(sheetId).then(result => {
            if (!result) return this.setState({ headerCols: [], rows: [] });
            
            const { values } = result.valueRanges[0];

            //First row is always the header
            const headerCols = values[0].map(value => {
                if (!value) return null; //Ignore empty column

                return <th key={`th${getRandom64()}`}>{value}</th>
            });

            var rows = [];
            for (var i = 1; i < values.length; i++) {
                const cols = values[i].map((value, idx) => {
                    if (!headerCols[idx]) return null; //Ignore column if there's no header

                    return <td key={`td${getRandom64()}`}>{value}</td>
                });

                rows.push(<tr key={`tr${getRandom64()}`}>{cols}</tr>)
            }

            this.setState({ headerCols, rows });
        });
    }

    render() {
        const { headerCols, rows } = this.state;

        const table =
            <>
                <thead><tr>{headerCols}</tr></thead>
                <tbody>{rows}</tbody>
            </>;

        const emptyTable =
            <>
                <thead>
                    <tr><th></th></tr>
                </thead>
                <tbody>
                    <tr><td>Loading...</td></tr>
                </tbody>
            </>;

        return (
            <table data-id={this.props['data-id']} className='plain-table' data-objtype={this.props['data-objtype']}>
                {rows.length ? table : emptyTable}
            </table>
        );
    }
}