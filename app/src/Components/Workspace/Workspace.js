import React from 'react';
import './css/Workspace.scss';

function Workspace(props) {    
    return (
        <div className='workspace'>
            <iframe id='workspace-content' ref={props.iframeRef} title='Workspace Content' src='/workspace/workspace.html' onLoad={props.onLoad} />            
        </div>
    );
}

export { Workspace }