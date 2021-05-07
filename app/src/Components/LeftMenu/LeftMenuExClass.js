import React from 'react';

export default class LeftMenuExClass extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: false,
            menu: ''
        }
    }

    setMenu(menu) {
        var isVisible = menu === this.state.menu ? !this.state.isVisible : true;
        this.setState({ isVisible, menu });

        return isVisible;
    }

    render() {
        if (this.state.isVisible)
            return <div className='left-menu-ex'>{this.props.getMenu(this.state.menu)}</div>
        else
            return <></>
    }
}