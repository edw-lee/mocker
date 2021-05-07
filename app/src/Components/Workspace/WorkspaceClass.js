import React from 'react';
import ReactDOM from 'react-dom'
import { Workspace } from './Workspace';
import * as IDBPageManager from '../../Managers/IDB/IDBPageManager'
import { getGoogleFontsUrl } from '../../Functions/Common';
import { createKeyId } from '../../Functions/ObjectProcessor';
import { connect } from 'react-redux'
import { addObjects, deselectAll, deselectObject, replaceObjects, selectObject, selectOneObject, setCurrentPage, updateOneObject } from '../../Redux/Workspace/WorkspaceActions'
import { findNearestObj } from './WorkspaceDistFunctions';
import { getAllSelected, move } from './WorkspaceMoveFunctions';
import { checkDoubleClick } from './WorkspaceClickFunctions';


const DRAGBOX_ID = 'dragbox';
const DRAGBOX_KEY = createKeyId('dragbox');

export const POSITION = { BEFORE: 0, INSIDE: 1, AFTER: 2 }

/**
 * 
 * @param {String} dataid 
 * @param {HTMLElement} container
 * @returns {HTMLElement}
 */
export const findHTMLObjWithDataID = (dataid, container) => {
    return container.querySelector(`[data-id=${dataid}]`);
}

class WorkspaceClass extends React.Component {
    /**@type{HTMLDocument} */
    htmlDoc = null;

    isCtrlDown = false;
    isSelecting = false;
    isEditing = false;

    startMousePos = { x: 0, y: 0 };
    mousePos = { x: 0, y: 0 };
    latestSelectId = '';

    mouseDragObjs = [];
    selectedObjs = [];

    doubleClickCounter = 0;

    state = {
        isDragging: false,
        dragPos: { x: 0, y: 0 },
        hoverId: ''
    }

    componentDidMount() {
        IDBPageManager.getTopFirstPage().then(page => {
            this.props.setCurrentPage(page.name);
        }).catch(e => {
            console.log(e);
        });
    }

    componentDidUpdate() {
        this.updateContainer();
    }

    updateContainer = () => {
        if (!this.container) return;

        var { objects, selectedIds } = this.props;
        const { hoverId, dragPos, isDragging } = this.state;

        //Add highlight to selected objects
        const addSelectorBox = _objects => {
            if (!_objects) return;

            const newObjects = [];
            _objects.forEach(obj => {
                if (!obj) return;

                //Some child might be an array, so just call addSelectorBox to check it and return the result
                if (obj instanceof Array)
                    return newObjects.push(addSelectorBox(obj));

                const dataid = obj.props['data-id'];
                const isDragObj = obj.props['data-isdragobj'];

                //Checks if children is selected
                let children = obj.props.children;
                if (children && typeof (children) !== 'string') {
                    if (children instanceof Array)
                        children = addSelectorBox(children);
                    else
                        children = addSelectorBox([children])[0];
                }

                /**@type{String} */
                let className = obj.props.className ? obj.props.className : '';
                //If selected, add selected class to className
                if (selectedIds.includes(dataid)) {
                    className = `${className} selected`.trim();
                    if (isDragging)
                        className = `${className} dragging`.trim();
                    else
                        className.replace(/(\bdragging\b)/g, '');
                } //If hovered, add hovered class to className
                else if (dataid === hoverId)
                    className = obj.props.className ? `${obj.props.className} hovered` : 'hovered';
                //If it is not selected or hovered and it is not a drag object
                //Then remove the selected, hovered or dragging classes added before
                //*(drag objects are objects that follows the mouse used for visualization only)
                else if (!isDragObj)
                    className = className.replace(/(\bselected\b|\bhovered\b|\bdragging\b)/g, '');

                let props = { ...obj.props, key: obj.key };
                //Assign the new className
                if (className.length)
                    props.className = className;

                //Assign the children
                if (children)
                    props.children = children;

                newObjects.push(React.createElement(obj.type, props));
            });

            return newObjects;
        }

        objects = addSelectorBox(objects);

        // if (isDragging)
        //     objects.push(<span key={DRAGBOX_KEY} id={DRAGBOX_ID} style={{ position: 'absolute', left: dragPos.x, top: dragPos.y }}>{this.mouseDragObjs}</span>);

        ReactDOM.render(objects, this.container, _ => {
            //Update the html document
            this.htmlDoc.dispatchEvent(new Event('update'));            
        });
    }

    iframeOnload = (iframe) => {
        this.htmlDoc = iframe.contentDocument;

        if (!this.htmlDoc) return;

        this.container = this.htmlDoc.getElementById('container');

        if (!this.container) return;

        const fontFamiliesLink = this.htmlDoc.getElementById('fontfamilieslink');
        fontFamiliesLink.setAttribute('href', getGoogleFontsUrl());

        this.htmlDoc.onmousedown = this.docOnMouseDown;
        this.htmlDoc.onmouseup = this.docOnMouseUp;
        this.htmlDoc.onmousemove = this.docOnMouseMove
        this.htmlDoc.onkeydown = this.docOnKeyDown;
        this.htmlDoc.onkeyup = this.docOnKeyUp;
        this.container.onmouseover = this.hoverOver;
        this.container.onmouseout = this.hoverOut;

        this.updateContainer();
    }

    updateHoverObj = (hoverId) => {
        if (hoverId !== this.state.hoverId)
            this.setState({ hoverId });
    }

    createDragObjects = () => {
        this.selectedObjs.forEach(obj => {
            if (!obj) return;

            const dataid = obj.props['data-id'];

            const htmlObj = findHTMLObjWithDataID(dataid, this.container);
            /**@type{React.CSSProperties} */
            const style = {
                position: 'absolute', width: `${htmlObj.clientWidth}px`, height: `${htmlObj.clientHeight}px`,
                left: `${htmlObj.offsetLeft}px`, top: `${htmlObj.offsetTop}px`,
                pointerEvents: 'none' //So that mouse events can pass throught the dragged objects
            }

            const className = obj.props.className ? `${obj.props.className} selecte` : 'selected';
            const clonedprops = { ...obj.props, key: obj.key, className }
            if (clonedprops['data-id']) delete clonedprops['data-id'];

            this.mouseDragObjs.push(
                <span style={style} key={`dragobj-${dataid}`}>
                    {React.createElement(obj.type, clonedprops)}
                </span>
            );
        });
    }

    mouseDrag = _ => {
        const { selectedIds } = this.props;

        const result = findNearestObj(this.props.objects, selectedIds, this.mousePos, this.container);

        if (result) {
            const nearestDataId = result.nearestDataId;
            const position = result.position;

            if (nearestDataId && nearestDataId.length && !selectedIds.includes(nearestDataId))
                this.moveObjPos(nearestDataId, position)
        }
    }

    /**
     * @param {string} nearestDataId 
     * @param {int} position
     */
    moveObjPos = (nearestDataId, position = POSITION.BEFORE) => {
        const { selectedIds, objects } = this.props;

        //Extract all the selected objects first
        const selectedObjs = getAllSelected(objects, selectedIds);

        //Switch the position of the selected objects with the hovered object by rearranging the objects array
        const movedObjects = move(objects, selectedObjs, nearestDataId, selectedIds, position);
        this.props.replaceObjects(movedObjects, this.state.isDragging);
    }

    setDoubleClickCounter = count => {
        this.doubleClickCounter = count;
    }

    setEditingFlag = flag => {
        this.isEditing = flag;
    }

    /** 
     * @param {string} dataid 
     */
    selectObject = (dataid, obj) => {
        const { selectedIds } = this.props;
        const objtype = obj.props['data-objtype'];
        const isMultiSelect = this.isCtrlDown;

        //If not multiple select and select it only
        if (!isMultiSelect) {
            checkDoubleClick(dataid, this.props.selectedIds, this.container, this.props.objects,
                this.doubleClickCounter, this.setDoubleClickCounter, this.setEditingFlag, this.props.updateOneObject);

            this.props.selectOneObject(dataid, objtype);
            this.latestSelectId = dataid;
            this.selectedObjs = [obj];
            //else if it is multiple select and it is not selected, add it to the selection
        } else if (isMultiSelect && !selectedIds.includes(dataid)) {
            this.props.selectObject(dataid, objtype);
            this.latestSelectId = dataid;
            this.selectedObjs.push(obj);
        }
    }

    deselectObject = (id, objtype) => {
        this.props.deselectObject(id, objtype);

        this.selectedObjs = this.selectedObjs.filter(obj => obj.props['data-id'] !== id);
    }

    /**     
     * @param {MouseEvent} e 
     */
    docOnMouseDown = (e) => {
        const target = this.getValidTarget(e.target);

        if (e.button === 0) {
            if (target) {
                const dataId = target.getAttribute('data-id');
                //Get the jsx object with the given dataid
                const selectedObj = this.getObjWithDataId(dataId);

                //If an object is found, initiate select algorithm
                if (selectedObj) {
                    this.selectObject(dataId, selectedObj);
                    this.isSelecting = e.button === 0;
                    this.startMousePos = this.mousePos = { x: e.pageX, y: e.pageY }
                }
            }
            else if (!this.isCtrlDown) {
                this.props.deselectAll();
                this.selectedObjs = [];
            }
        }
    }

    /**     
    * @param {MouseEvent} e 
    */
    docOnMouseMove = (e) => {
        const { selectedIds } = this.props;

        if (this.isSelecting && selectedIds.length > 0 && !this.isEditing) {
            if (!this.state.isDragging) {
                //this.createDragObjects();
                this.setState({ isDragging: true });

                //For input objects
                this.props.selectedIds.forEach(id => {
                    /**@type{HTMLElement}*/
                    const htmlObj = findHTMLObjWithDataID(id, this.container);
                    if (htmlObj.nodeName === 'INPUT')
                        htmlObj.blur();
                });
            } else {
                const x = e.pageX - this.startMousePos.x;
                const y = e.pageY - this.startMousePos.y;
                this.setState({ dragPos: { x, y } }, this.mouseDrag());

                this.mousePos = { x: e.pageX, y: e.pageY };
            }
        }
    }

    /**     
     * @param {MouseEvent} e 
     */
    docOnMouseUp = (e) => {
        if (e.button === 0) {
            /**@type{HTMLElement} */
            const target = this.getValidTarget(e.target);
            const { selectedIds, objects } = this.props;

            if (target && !this.state.isDragging) {
                //If it is not the previous selected object, and it is selected
                const dataid = target.getAttribute('data-id');
                const objtype = target.getAttribute('data-objtype');
                if (dataid !== this.latestSelectId && selectedIds.includes(dataid))
                    this.deselectObject(dataid, objtype);
            }

            this.latestSelectId = '';
            this.isSelecting = !e.button === 0;

            if (this.state.isDragging) {
                this.setState({ isDragging: false, dragPos: { x: 0, y: 0 }, isMoved: false });
                this.mouseDragObjs = [];
                //To update the history
                this.props.replaceObjects(objects, false);
            }
        }
    }

    docOnKeyDown = (e) => {
        this.isCtrlDown = e.key === 'Control';
    }

    docOnKeyUp = (e) => {
        this.isCtrlDown = !e.key === 'Control';

        if (e.key === 'Delete' && !this.isEditing)
            this.delete();
    }

    delete = _ => {
        const { selectedIds } = this.props;

        const _delete = objects => objects.map(obj => {
            if (selectedIds.includes(obj.props['data-id']))
                return;

            let objChildren = obj.props.children;
            if (objChildren) {
                if (objChildren instanceof Array) {
                    const children = _delete(objChildren);
                    //If the returned children is not the same, return a new element with new children
                    if (children !== objChildren)
                        return React.createElement(obj.type, { ...obj.props, key: obj.key, children });
                } else if (objChildren.props && selectedIds.includes(objChildren.props['data-id']))
                    return;
            }

            return obj;
        }).filter(obj => obj); //Filters any undefined/null objects

        //Update the objects
        this.props.replaceObjects(_delete(this.props.objects));
    }

    hoverOver = (e) => {
        const target = this.getValidTarget(e.target);

        if (!target) return;

        const dataid = target.getAttribute('data-id');

        if (!this.state.isDragging)
            this.updateHoverObj(dataid);
    }

    hoverOut = (e) => {
        this.updateHoverObj('');
    }

    getValidTarget = target => {
        //Get the closest object with data-id attribute (eg. itself > parent > grandparent > etc.)
        //And is not draggable
        return target.closest('[data-id]:not([data-isdraggable$=false])');
    }

    getObjWithDataId = dataId => {
        const findObj = objects => {
            let foundObj = null;

            //Find the data-id from the workspace objects
            for (var i = 0; i < objects.length; i++) {
                const obj = objects[i];

                if (!obj || !obj.props) continue;

                //Check if theres children, if there is loop through it to find the data-id                
                let children = obj.props.children;
                if (children) {
                    if (children instanceof Array) {
                        foundObj = findObj(children);
                        if (foundObj) return foundObj;
                        //If the children is not an array but its an HTML object, check the data-id
                    } else if (typeof (children) === 'object' && children.props['data-id'] === dataId)
                        return children;
                }

                //If all the above statements fails to find the object with the data-id,
                //check the current object of the loop
                if (obj.props['data-id'] === dataId && obj.props['data-isdraggable'] !== false)
                    return obj;
            }

            return null;
        }

        return findObj(this.props.objects);
    }

    render() {
        return <Workspace onLoad={(e) => this.iframeOnload(e.target)} />;
    }
}

const mapStatesToProps = state => {
    return state.workspace
}

const mapDispatchToProps = dispatch => {
    return {
        addObjects: objects => dispatch(addObjects(objects)),
        replaceObjects: (objects, isDragging) => dispatch(replaceObjects(objects, isDragging)),
        updateOneObject: (idx, object) => dispatch(updateOneObject(idx, object)),
        setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage)),
        selectOneObject: (dataid, objtype) => dispatch(selectOneObject(dataid, objtype)),
        selectObject: (dataid, objtype) => dispatch(selectObject(dataid, objtype)),
        deselectObject: (dataid, objtype) => dispatch(deselectObject(dataid, objtype)),
        deselectAll: _ => dispatch(deselectAll())
    }
}

export default connect(mapStatesToProps, mapDispatchToProps)(WorkspaceClass);