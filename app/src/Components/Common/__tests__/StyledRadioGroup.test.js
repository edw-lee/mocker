import { fireEvent, render } from '@testing-library/react';
import StyledRadioGroup from '../StyledRadioGroup';

describe('StyledRadioGroup', () => {
    test('Display correctly', () => {
        const testLabels = ['label 1', 'label 2', 'label 3'];
        const testValues = ['value 1', 'value 2', 'value 3'];
        const { getByTestId } = render(<StyledRadioGroup labels={testLabels} values={testValues} checkedValue={testValues[0]} name='test'/>);
        const styledRadioGroup = getByTestId('styledRadioGroup');
        const inputs = styledRadioGroup.getElementsByTagName('input');
        const labels = styledRadioGroup.getElementsByTagName('label');

        expect(inputs.length).toBe(testLabels.length);
        expect(labels.length).toBe(testLabels.length);
        expect(inputs[0].checked).toBeTruthy();
        for(let i = 1; i < testLabels.length; i++)
            expect(inputs[i].checked).toBeFalsy();
    });

    test('Select radio buttons correctly', () => {
        const testLabels = ['label 1', 'label 2', 'label 3'];
        const testValues = ['value 1', 'value 2', 'value 3'];
        const { getByTestId } = render(<StyledRadioGroup labels={testLabels} values={testValues} checkedValue={testValues[0]} name='test'/>);
        const styledRadioGroup = getByTestId('styledRadioGroup');
        const inputs = styledRadioGroup.getElementsByTagName('input');

        expect(inputs[0].checked).toBeTruthy();

        for(let i = 1; i < testLabels.length; i++)
        {
            fireEvent.click(inputs[i]);

            expect(inputs[i].checked).toBeTruthy();

            //To make sure the other radio buttons are unchecked
            for(let j = 0; j < testLabels.length; j++)
            {
                if(j === i)
                    continue;

                expect(inputs[j].checked).toBeFalsy();
            }
        }
    });
});