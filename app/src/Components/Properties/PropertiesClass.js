import React from 'react';
import './css/Properties.scss';
import propPanelsDict from './PropsDict';
import { connect } from 'react-redux';
import { replaceObjects } from '../../Redux/Workspace/WorkspaceActions';
import PropsBox from './PropsBox';

class PropertiesClass extends React.Component {

    getPropPanels = () => {
        const selectedObjTypes = Object.keys(this.props.selectedObjTypes);

        const propPanels = Object.keys(propPanelsDict).filter(propKey => {
            const prop = propPanelsDict[propKey];

            //Returns true if theres no included or excluded array
            if (!prop.included && !prop.excluded)
                return true;
            //Returns true if it is included        
            else if (prop.included)
                return selectedObjTypes.every(objtype => prop.included.includes(objtype));
            //If there are no included array, then only checks the excluded array 
            //Returns true if it is excluded
            else if (prop.excluded)
                return selectedObjTypes.every(objtype => !prop.excluded.includes(objtype));
            else
                return null;
        }).map(propKey => {
            const prop = propPanelsDict[propKey];

            return React.createElement(prop.object, {
                key: prop.name,
                updateObjectsProps: this.updateObjectsProps,
                getSelectedCommonProp: this.getSelectedCommonProp,                
            });
        });

        return propPanels;
    }

    //getCommonProp function determines which object prop to be returned
    //An object will be passed to the getCommonProp function as a parameter
    getSelectedCommonProp = getter => {
        const { selectedIds } = this.props;

        if (!this.props.objects || !this.props.objects.length || !selectedIds.length)
            return undefined;

        let selectedObjects = [];

        const getSelected = objects => {
            objects.forEach(obj => {
                if (!obj || !obj.props) return;

                if (selectedIds.includes(obj.props['data-id']))
                    selectedObjects.push(obj);

                let children = obj.props.children;
                if (children && typeof (children) !== 'string') {
                    if (!(children instanceof Array))
                        children = [children];

                    getSelected(children);
                }
            });
        }

        getSelected(this.props.objects);

        if (!selectedObjects.length)
            return undefined;

        let commonProp = getter(selectedObjects[0]);
        for (var i = 1; i < selectedObjects.length; i++) {
            if (getter(selectedObjects[i]) !== commonProp)
                return undefined;
        }

        return commonProp;
    }       

    //This function will be passed to the properties panels and the panels will pass a setter function to this function to update the selected objects
    updateObjectsProps = setter => {
        let { selectedIds } = this.props;

        if (!this.props.objects) return;

        const updateObj = objects => {
            objects = objects.map(obj => {
                if (!obj) return null;

                if (obj instanceof Array)
                    return updateObj(obj);

                //Check the children recursively
                let children = obj.props.children;
                if (children && typeof (children) !== 'string') {
                    if (!(children instanceof Array))
                        children = [children];

                    children = updateObj(children);
                }

                //Check this object if this object is selected
                if (selectedIds.includes(obj.props['data-id'])) {
                    //Retrieve the new object props using the setter function passed from the properties panels
                    const newObjData = setter(obj);
                    
                    if (newObjData.props) {
                        //Merge old and new styles
                        if (newObjData.props.style)
                            newObjData.props.style = { ...obj.props.style, ...newObjData.props.style }

                        //Get the new children
                        if (newObjData.props.children)
                            children = newObjData.props.children;
                    }

                    //Get the new object type, if no type provided then use the old object type
                    let type = newObjData.type ? newObjData.type : obj.type;

                    //Add a key because it will be gone when the element is recreated
                    if (!newObjData.props)
                        newObjData.props = { key: obj.key };
                    else
                        newObjData.props.key = obj.key;

                    return React.createElement(type, { ...obj.props, ...newObjData.props, children });
                } else { 
                    //If the object is not selected and the children was not changed then just use the original object
                    if (children === obj.props.children)
                        return obj;
                    //If the children was changed, create a new element with the new children
                    else
                        return React.createElement(obj.type, { ...obj.props, key: obj.key, children });
                }
            });

            //Use the first object if the array contains 1 object only
            if (objects.length === 1)
                objects = objects[0];

            return objects;
        };

        //TODO: Fix bug where this is called everytime the properties panel appears. Probably due to the onChange function of the input fields
        //Update the objects in redux
        this.props.replaceObjects(updateObj(this.props.objects));
    }

    render() {
        let propPanels;
        if (this.props.selectedIds.length)
            propPanels = this.getPropPanels();

        return (
            <div className='properties'>
                {this.props.selectedIds.length ? propPanels
                    : <PropsBox className='props-center' title='Properties'>
                        <div style={{ textAlign: 'center' }}>No items selected.</div>
                    </PropsBox>}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedObjTypes: state.workspace.selectedObjTypes,
        selectedIds: state.workspace.selectedIds,
        objects: state.workspace.objects
    }
}

const mapDispatchToProps = dispatch => {
    return {
        replaceObjects: objects => dispatch(replaceObjects(objects))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesClass);