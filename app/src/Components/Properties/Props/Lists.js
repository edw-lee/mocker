import { useRef } from "react";
import StyledRadioGroup from "../../Common/StyledRadioGroup";
import { createTypeObj } from "../CommonPropReturns";
import PropsBox from "../PropsBox";

export default function ListStyles({ updateObjectsProps, getSelectedCommonProp }) {
    const radioRef = useRef();

    const selectedListType = getSelectedCommonProp(obj => obj.type);

    const changeListType = listType => updateObjectsProps(()=> createTypeObj(listType));

    return (
        <PropsBox title='Lists'>
            <StyledRadioGroup ref={radioRef} labels={['Bullet', 'Numbered']} values={['ul', 'ol']} name='radiolist-option'
                checkedValue={selectedListType} onChange={e => changeListType(e.target.value)} />
        </PropsBox>
    );
}