import React from 'react';
import { createKeyId } from '../../../Functions/ObjectProcessor';

export default function TableObject(props) {
    const { rows, cols, hasHeader, hasFooter } = props.tableProps;

    var i = 0

    //Create thead cols        
    var headerCols = [];
    if (hasHeader) {
        for (i = 0; i < cols; i++) {
            headerCols.push(<th key={createKeyId('th')}></th>)
        }
    }

    //Create tbody rows
    var tableRows = [];
    for (i = 0; i < rows; i++) {
        var tableCols = [];
        for (var j = 0; j < cols; j++) {
            const id = createKeyId(`td${i * rows + j}`);
            tableCols.push(<td key={id} data-id={id} data-istablecell={true} data-isdraggable={false}></td>);
        }
        
        tableRows.push(<tr key={createKeyId(`tr${i}`)}>{tableCols}</tr>);
    }

    //Create tfoot cols
    var footerCols = [];
    if (hasFooter) {
        for (i = 0; i < cols; i++) {
            footerCols.push(<td key={createKeyId('tf')}></td>)
        }
    }

    const className = props.className ? `plain-table ${props.className}` : 'plain-table';
    return (
        <table data-id={props['data-id']} className={className} data-objtype={props['data-objtype']}>
            {hasHeader &&
                <thead>
                    <tr>{headerCols}</tr>
                </thead>}

            {/* Since the <tr> inside has dataid, tbody need to have dataid too */}
            <tbody>
                {tableRows}
            </tbody>

            {hasFooter &&
                <tfoot>
                    <tr>{footerCols}</tr>
                </tfoot>}
        </table>
    );
}