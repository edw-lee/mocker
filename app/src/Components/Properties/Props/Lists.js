import { useRef } from "react";
import { StyledRadioGroupClass } from "../../Common/StyledRadioGroupClass";
import { createTypeObj } from "../CommonPropReturns";
import PropsBox from "../PropsBox";

export default function ListStyles({ updateObjectsProps, getSelectedCommonProp }) {
    const radioRef = useRef();

    const selectedListType = getSelectedCommonProp(obj => obj.type);

    const changeListType = listType => updateObjectsProps(_ => createTypeObj(listType));

    return (
        <PropsBox title='Lists'>
            <StyledRadioGroupClass ref={radioRef} labels={['Bullet', 'Numbered']} values={['ul', 'ol']} name='radiolist-option'
                checkedValue={selectedListType} onChange={e => changeListType(e.target.value)} />
        </PropsBox>
    );
}