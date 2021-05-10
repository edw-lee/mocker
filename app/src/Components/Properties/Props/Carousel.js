import { useRef } from "react";
import { createKeyId } from "../../../Functions/ObjectProcessor";
import { RadioAndListDialog } from "../../Common/RadioAndListDialog";
import PropsBox from "../PropsBox";

export default function Carousel({ updateObjectsProps, getSelectedCommonProp }) {
    const urlListRef = useRef();

    let urls = getSelectedCommonProp(obj => {
        const children = obj.props.children;

        if (children && typeof (children) !== 'string') {
            //Get the carousel wrapper div
            let wrapper = children.filter(child => child.props.className.includes('carousel-wrapper'));
            //There should only be 1 carousel wrapper
            if (wrapper) {
                wrapper = wrapper[0];

                //Get the slides, which is the children of the wrapper
                const slides = wrapper.props.children;

                //Retrieve the src from the <img> element in the children of the slides
                const urls = slides.map(slide => {
                    let img = slide.props.children;
                    //Sometimes React renderer might render it as an array - (TODO: check ObjectProcessor.js or WorkspaceClass.js's update function)
                    if (img instanceof Array)
                        img = img[0];

                    return img.props.src;
                });

                return urls;
            }
        }
    });

    if (!urls) urls = [];

    const updateUrls = urls => updateObjectsProps(obj => {
        let children = obj.props.children;

        if (children && typeof (children) !== 'string') {
            children = [...children];

            //Get the carousel wrapper index
            const wrapperIdx = children.findIndex(child => child.props.className.includes('carousel-wrapper'));
            if (wrapperIdx >= 0) {
                //Use ... syntax to make wrapper modifiable
                let wrapper = children[wrapperIdx];

                //Get the slides, which is the children of the wrapper
                let slides = wrapper.props.children;

                const newSlides = urls.map((url, idx) => {
                    const slide = slides[idx];
                    let className = slide && slide.props.className ? slide.props.className : 'carousel-item';
                    let slideKey = slide ? slide.key : createKeyId('carousel-item');
                    let img = slide ? slide.props.children[0] : undefined;
                    let imgKey = img ? img.key : createKeyId('img');
                    
                    return (
                        <div key={slideKey} className={className}>
                            <img key={imgKey} src={url} draggable={false} alt={url}/>
                        </div>
                    );
                });
                
                //Replace slides in the wrapper
                children[wrapperIdx] = { type: wrapper.type, key: wrapper.key, props: { ...wrapper.props, children: newSlides } };
            }
        }

        //Clear the new item input field
        urlListRef.current.clearNewItem();

        //Return the updated or original children to update the selected object
        return { props: { children } };
    });
    
    return (
        <PropsBox title='Carousel'>
            <RadioAndListDialog placeholder='Enter image url here' items={urls} ref={urlListRef}/>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className='primary-btn' onClick={e => updateUrls(urlListRef.current.getItems())}>Update</button>
            </div>
        </PropsBox>
    );
}