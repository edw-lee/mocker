import React from 'react';
//eslint-disable-next-line
import RadioAndListDialog from '../Common/RadioAndListDialog'
import { getRandom64 } from '../../Functions/Common';
import { createKeyId } from '../../Functions/ObjectProcessor';
import RadioButtonGroup from '../Common/RadioButtonGroup';
import CreateFormDialog from './Dialogs/CreateFormDialog';
import { getSheet } from '../../Managers/GoogleAPIs/GoogleSheet'
import CreateTableDialog from './Dialogs/CreateTableDialog';
import CreateLinkedTableDialog from './Dialogs/CreateLinkedTableDialog';
import CreateGridLayoutDialog from './Dialogs/CreateGridLayoutDialog';
import Objects from './Objects'
import CarouselObject from './Objects/CarouselObject';

const OK_BTN_TEXT = 'Create';
export const OBJ_TYPES = {
    heading: 'heading', paragraph: 'paragraph', label: 'label', input: 'input',
    list: 'list', link: 'link', button: 'button', radio: 'radio', img: 'img', form: 'form',
    table: 'table', layout: 'layout', carousel:'carousel'
}

export function createHeading(addObjects) {
    addObjects(<h1 data-objtype={OBJ_TYPES.heading} data-editable={true}>Heading</h1>);
}

export function createParagraph(addObjects) {
    addObjects(<p data-objtype={OBJ_TYPES.paragraph} data-editable={true}>This is a paragraph text.</p>);
}

export function createLabel(addObjects) {
    addObjects(<label data-objtype={OBJ_TYPES.label}
        data-editable={true}
        data-singleline={true}
        style={{ margin: '0.5rem', fontFamily: 'sans-serif' }}>Label</label>);
}

export function createInput(addObjects) {
    addObjects(<input data-objtype={OBJ_TYPES.input} />);
}

export function createList(addObjects, showDialogBox) {
    const listDialogRef = React.createRef();

    showDialogBox({
        title: 'Create List',
        msg: <RadioAndListDialog labels={['Bullet', 'Numbered']} values={['ul', 'ol']}
            checkedValue='ul' placeholder='Enter an item' ref={listDialogRef} />,
        okFunction: () => {
            const listDialog = listDialogRef.current;

            const listType = listDialog.getRadioValue();
            const items = listDialog.getItems();
            const listItems = items.map(item => {
                return <li key={createKeyId('li')}>{item}</li>
            });

            const list = React.createElement(listType, { children: listItems, 'data-objtype': OBJ_TYPES.list, 'data-editable': true });

            return addObjects(list);
        },
        okText: OK_BTN_TEXT
    })
}

export function createLink(addObjects, showDialogBox) {
    const displayTextRef = React.createRef();
    const urlRef = React.createRef();

    showDialogBox({
        title: 'Create Link',
        msg: (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <input style={{ marginBottom: '0.5rem' }} ref={urlRef} placeholder='Enter URL' />
                <input placeholder='Enter display text (Optional)' ref={displayTextRef} />
            </div>
        ),
        okFunction: () => {
            var displayText = displayTextRef.current.value;
            const url = urlRef.current.value;
            if (!url) return;
            if (!displayText) displayText = url;
            addObjects(
                <a data-objtype={OBJ_TYPES.link}
                    onClick={e => e.preventDefault()} href={url}
                    draggable={false}>
                    {displayText}
                </a>
            );
        },
        okText: OK_BTN_TEXT
    })
}

export function createButton(addObjects) {
    addObjects(<button data-objtype='button'>Button</button>);
}

export function createRadioButton(addObjects, showDialogBox) {
    const radioBtnDialogRef = React.createRef();
    const radioBtnName = `rb-${getRandom64()}`

    showDialogBox({
        title: 'Create Radio Buttons',
        msg: <RadioAndListDialog labels={['Horizontal', 'Vertical']} values={['h', 'v']}
            checkedValue='h' placeholder='Enter a label' ref={radioBtnDialogRef} />,
        okFunction: () => {
            /**@type{Array} */
            const radioBtnDialog = radioBtnDialogRef.current;
            const radioBtnLabels = radioBtnDialog.getItems();
            const radioBtnLayout = radioBtnDialog.getRadioValue();

            addObjects(RadioButtonGroup({ labels: radioBtnLabels, name: radioBtnName, layout: radioBtnLayout, objType: OBJ_TYPES.radio }));
        },
        okText: OK_BTN_TEXT,
    })
}

export function createImage(addObjects, showDialogBox) {
    var imgSrcRef = React.createRef();

    showDialogBox({
        title: 'Create Image',
        msg: <input ref={imgSrcRef} placeholder='Enter image url' />,
        okFunction: () => {
            const src = imgSrcRef.current.value;

            if (!src) return;

            addObjects(<img src={src} alt='' data-objtype={OBJ_TYPES.img} draggable={false} />)
        }
    })
}

export function createForm(addObjects, showDialogBox) {
    var dialogRef = React.createRef();

    showDialogBox({
        title: 'Create Form',
        msg: <CreateFormDialog ref={dialogRef} />,
        okFunction: () => {
            /**@type{CreateFormDialog} */
            const formDialog = dialogRef.current;
            const selectedSheetValue = formDialog.getSelectedSheet();
            const formType = formDialog.getFormType();

            if (selectedSheetValue) {
                getSheet(formDialog.getSelectedSheet()).then(sheet => {
                    const columns = sheet.valueRanges[0].values[0];
                    addObjects(<Objects.FormObject action={`${process.env.REACT_APP_BACKENDURL}/googlesheet/${formType.toLowerCase()}/${selectedSheetValue}`}
                        columns={columns} formType={formType} data-objtype={OBJ_TYPES.form} />)
                }).catch(e => {
                    console.log(e);
                });
            }
        },
        okText: OK_BTN_TEXT
    });
}

export function createTable(addObjects, showDialogBox) {
    const dialogRef = React.createRef();

    showDialogBox({
        title: 'Create Table',
        msg: <CreateTableDialog ref={dialogRef} />,
        okFunction: () => {
            addObjects(Objects.TableObject({ tableProps: dialogRef.current.getTableProps(), "data-objtype": OBJ_TYPES.table }));
        }
    })
}

export function createLinkedTable(addObjects, showDialogBox) {
    const dialogRef = React.createRef();

    showDialogBox({
        title: 'Create Linked Table',
        msg: <CreateLinkedTableDialog ref={dialogRef} />,
        okFunction: () => {
            addObjects(<Objects.LinkedTableObject sheetId={dialogRef.current.getSheetId()} data-objtype={OBJ_TYPES.table} />);
        }
    })
}

export function createLayout(addObjects, direction = 'row') {
    addObjects(<div className='layoutbox' data-islayout={true} style={{ display: 'flex', flexDirection: direction, padding: '0.5rem' }}
        data-objtype={OBJ_TYPES.layout}></div>)
}

export function createGridLayout(addObjects, showDialogBox) {
    const dialogRef = React.createRef();

    showDialogBox({
        title: 'Create Grid Layout',
        msg: <CreateGridLayoutDialog ref={dialogRef} />,
        okFunction: () => {
            const { noOfCols, colGap, rowGap } = dialogRef.current;
            let colTemplate = '';
            for (var i = 0; i < noOfCols; i++)
                colTemplate += 'auto ';

            addObjects(<div className='layoutbox' data-islayout={true} data-objtype={OBJ_TYPES.layout}
                style={{ display: 'grid', gridTemplateColumns: colTemplate, columnGap: `${colGap}px`, rowGap: `${rowGap}px`, padding: '0.25rem' }}></div>)
        }
    })
}

//DEPRECATED
//Might not need a dialog, just create a carousel with placeholders and let user change the urls in the properties panel
export function createCarouselWithDialog(addObjects, showDialogBox) {
    const carouselDialogRef = React.createRef();

    showDialogBox({
        title: 'Create Carousel',
        msg: <RadioAndListDialog labels={['Slide', 'Fade']} values={['slide', 'fade']} checkedValue='slide'
            placeholder='Enter a image url' ref={carouselDialogRef} />,
        okFunction: () => {
            const carouselDialog = carouselDialogRef.current;
            let urls = carouselDialog.getItems();

            //Set the default urls if no urls were retrieved
            if (!urls.length)
                urls = ['/images/banner_placeholder_light.webp', '/images/banner_placeholder_dark.webp', '/images/banner_placeholder_light.webp'];

            addObjects(CarouselObject({ urls }));
        },
        okText: OK_BTN_TEXT,
    })
}

export function createCarousel(addObjects, showDialogBox) {
    addObjects(CarouselObject({ urls: ['/images/banner_placeholder_dark.webp', '/images/banner_placeholder_light.webp', '/images/banner_placeholder_dark.webp'] }));
}
