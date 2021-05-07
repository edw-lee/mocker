import React from 'react';
import { getRandom64, numberToAlphabet as numberToAlpha } from "../../../Functions/Common";

export default function FormObject(props) {
    var { action, columns, formType } = props;

    const createInputFields = (name) => {
        const inputFields = columns.map((column, idx) => {
            const inputName = `${name}${numberToAlpha(idx)}`;
            if (column)
                return (
                    <div key={`${column}-${getRandom64()}`} style={{ marginBottom: '0.5rem' }}>
                        <label style={{ marginRight: '0.5rem' }}>{column}</label>
                        <input name={inputName} />
                    </div>
                )
            else
                return <input key={getRandom64()} type="hidden" name={inputName} />;
        });

        return inputFields;
    }

    const queryFields = formType === 'Update' ? createInputFields('query') : [];

    const inputFields = createInputFields('')

    const hasQuery = queryFields.length > 0;

    return (
        <form data-id={props["data-id"]} action={action} method="POST" data-objtype={props['data-objtype']}>
            {hasQuery &&
                <div>
                    <h4>Query:</h4>
                    {queryFields}

                    <h4 style={{ marginTop: '2rem' }}>New Info:</h4>
                </div>
            }

            {inputFields}

            {/*TODO: add onclick function to submit form without redirecting*/}
            <input type='button' value={formType} onClick={() => console.log('test')} />
        </form>
    );
}