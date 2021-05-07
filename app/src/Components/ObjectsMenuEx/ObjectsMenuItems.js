import React from 'react';
import { TextFields, RadioButtonChecked, Notes, ViewCarousel } from "@material-ui/icons";
import * as ObjectCreator from './ObjectCreators'

export const objectMenuItems = {
    Texts: {
        objects: [
            {
                name: 'Heading',
                icon: <i className="fas fa-heading"></i>,
                create: ObjectCreator.createHeading
            },
            {
                name: 'Paragraph',
                icon: <Notes />,
                create: ObjectCreator.createParagraph                
            },
            {
                name: 'Label',
                icon: <i className="fas fa-tag"></i>,
                create: ObjectCreator.createLabel
            },
            {
                name: 'List',
                icon: <i className="fas fa-list"></i>,
                create: ObjectCreator.createList
            },           
        ]
    },
    Interactives: {
        objects: [
            {
                name: 'Button',
                icon:
                    <span style={{                        
                        fontSize: '0.7rem',
                        padding: '0.1rem',
                        border: '0.15rem solid',
                        borderBottom: '0.4rem solid',
                        borderRadius: '0.3rem', 
                        marginBottom: '0.35rem'                       
                    }}>Button</span>,
                create: ObjectCreator.createButton
            },
            {
                name: 'Link',
                icon: <i className="fas fa-link"></i>,
                create: ObjectCreator.createLink
            },
            {
                name: 'Input',
                icon: <TextFields />,
                create: ObjectCreator.createInput
            },
            {
                name: 'Radio Button',
                icon: <RadioButtonChecked style={{ marginBottom: '0.25rem' }} />,
                create: ObjectCreator.createRadioButton
            },
            {
                name: 'Form',
                icon:
                    <i className='far fa-file' style={{position:'relative'}}>
                        <i className='fas fa-search'
                            style={{
                                position: 'absolute',
                                fontSize: '0.8rem',
                                right: '0.1rem',
                                bottom: '0.15rem'
                            }}></i>
                    </i>,
                create: ObjectCreator.createForm,
                hidden: true
            },
        ]
    },
    Visuals: {
        objects: [
            {
                name: 'Image',
                icon: <i className='far fa-image'></i>,
                create: ObjectCreator.createImage
            },
            {
                name: 'Carousel',
                icon: <ViewCarousel/>,
                create: ObjectCreator.createCarousel
            }
        ]
    },   
    Tables: {
        objects: [
            {
                name: 'Table',
                icon: <i className="fas fa-table"></i>,
                create: ObjectCreator.createTable
            },
            {
                name: 'Linked Table',
                icon:
                    <i className="fas fa-table" style={{position:'relative'}}>
                        <i className='fas fa-link'
                            style={{
                                position: 'absolute',
                                fontSize: '1.2rem',
                                right: '-1rem',
                                bottom: '0rem'
                            }}></i>
                    </i>,
                create: ObjectCreator.createLinkedTable,
                hidden:true
            },
        ]
    },
    Layouts: {
        objects: [
            {
                name: 'Horizontal\nLayout',
                icon: <i className="fas fa-grip-horizontal"></i>,
                create: (addObjects) => ObjectCreator.createLayout(addObjects, 'row')
            },
            {
                name: 'Vertical\nLayout',
                icon: <i className="fas fa-grip-vertical"></i>,
                create: (addObjects) => ObjectCreator.createLayout(addObjects, 'column')
            },
            {
                name: 'Grid Layout',
                icon: <i className="fas fa-th"></i>,
                create: ObjectCreator.createGridLayout
            }
        ]
    },
    Navbars: {
        objects: [],
        hidden: true
    },
    Graphics: {
        objects: [],
        hidden: true
    },
}
