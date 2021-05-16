import { render } from '@testing-library/react';
import RadioBttonGroup from '../RadioButtonGroup';

describe('RadioButtonGroup', () => {
    test('Display correctly', () => {
        const testLabels = ['label1', 'label2', 'label3'];
        const name = 'radioGroup';
        const { getByTestId } = render(<RadioBttonGroup labels={testLabels} name={name} />);
        const radioButtonGroup = getByTestId('radioButtonGroup');
        const inputs = radioButtonGroup.getElementsByTagName('input');
        const labels = radioButtonGroup.getElementsByTagName('label');

        expect(radioButtonGroup).toHaveStyle({ flexDirection: 'row' });
        expect(testLabels.length).toBe(testLabels.length);
        expect(inputs.length).toBe(testLabels.length);

        testLabels.forEach((label, idx) => {
            expect(inputs[idx].name).toBe(name);
            expect(labels[idx]).toHaveTextContent(label);
        });
    });

    test('Correct layout shown', () => {
        const { getByTestId } = render(<RadioBttonGroup layout='v' />);
        const radioButtonGroup = getByTestId('radioButtonGroup');

        expect(radioButtonGroup).toHaveStyle({ flexDirection: 'column' });
    });
});