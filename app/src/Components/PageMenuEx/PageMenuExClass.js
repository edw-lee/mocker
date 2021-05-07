import React from 'react';
import { PageMenuEx } from './PageMenuEx'
import * as IDBPageManager from '../../Managers/IDB/IDBPageManager'
import { connect } from 'react-redux';
import { showDialogBox } from '../../Redux/DialogBox/DialogBoxActions';
import { setCurrentPage } from '../../Redux/Workspace/WorkspaceActions'

const PAGE_NAME_MAX_LEN = 30;

class PageMenuExClass extends React.Component {
    state = {
        pages: null
    }

    componentDidMount() {
        IDBPageManager.getAllPages().then(pages => {
            if (this.state.pages !== pages)
                this.setState({ pages });
        }).catch(e => {
            console.log(e);
        });
    }

    addPage = () => {
        let pageNameRef = React.createRef();
        this.props.showDialogBox({
            title: 'Create New Page',
            msg: <input ref={pageNameRef} placeholder='Enter page name' />,
            okFunction: () => {
                let pageName = pageNameRef.current.value;

                if (!pageName) return;

                if (pageName.length > PAGE_NAME_MAX_LEN) pageName = pageName.slice(0, PAGE_NAME_MAX_LEN);

                IDBPageManager.createNewPage(pageName).then(page => {
                    this.setState({ pages: [...this.state.pages, page] });
                }).catch(e => {
                    console.log(e);
                });
            }
        });
    }

    deletePage() {

    }

    render() {
        if (!this.state.pages) return <></>

        return <PageMenuEx pages={this.state.pages} parent={this} />
    }
}

const mapStateToProps = state => {
    return {
        currentPage: state.workspace.currentPage
    }
}

const mapDispatchToProps = dispatch => {
    return {
        showDialogBox: dialogbox => dispatch(showDialogBox(dialogbox, dispatch)),
        setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PageMenuExClass);