import React from 'react';
import { connect } from 'react-redux';
import { createKeyId } from '../../Functions/ObjectProcessor';
import './css/HierarchyMenuEx.scss'

class HierarchyMenuExClass extends React.Component {
    render() {
        if (this.props.objects.length) {
            const getObjectsList = objects => {
                if (objects.length) {
                    return objects.map(obj => {
                        var children = null;
                        //Recurse through the arrays of children to get the list og children
                        if (obj instanceof Array)
                            children = getObjectsList(obj);
                        else if (obj.props && typeof (obj.props.children) === 'object')
                            children = getObjectsList(obj.props.children);

                        if (obj.key)
                            return <li key={createKeyId('li')}>
                                <span>{obj.key}</span>

                                {children && <ul key={createKeyId('ul')}>{children}</ul>}
                            </li>; 
                        else
                            return children;
                    }).filter(obj => obj !== null); //Filters out null children
                }
            }

            return (
                <ul className='hierarchy'>
                    {getObjectsList(this.props.objects)}
                </ul>
            );
        } else
            return <div className='empty-hierarchy'>No objects in workspace.</div>
    }
}

const mapStateToProps = state => {
    return {
        objects: state.workspace.objects
    }
}

export default connect(mapStateToProps, null)(HierarchyMenuExClass);