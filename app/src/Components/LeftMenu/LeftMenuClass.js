import React from 'react';
import './css/LeftMenu.scss'
import { MenuList } from '../Common'
import LeftMenuExClass from './LeftMenuExClass'
import LeftMenuItems from './LeftMenuItems'

export default class LeftMenuClass extends React.Component {
    leftMenuExRef = React.createRef();
    leftMenuItems = LeftMenuItems();

    constructor() {
        super();
        this.state = {
            activeMenu: ''
        }
    }

    toggleMenu(menu) {
        var isVisible = this.leftMenuExRef.current.setMenu(menu);
        this.setState({ activeMenu: isVisible ? menu : '' });
    }

    getMenu(key) {
        if (this.leftMenuItems[key])
            return this.leftMenuItems[key].menu;

        return <></>
    }

    render() {
        const leftBarItems = Object.keys(this.leftMenuItems).map((key) => {
            let item = this.leftMenuItems[key];
            if(item.hidden) return null
                
            return (
                <li key={key} title={key}
                    className={this.state.activeMenu === key ? 'active' : ''}
                    onClick={() => this.toggleMenu(key)}>
                    {item.icon}
                </li>
            );
        });

        return (
            <>
                <MenuList className='left-menu'>{leftBarItems}</MenuList>
                <LeftMenuExClass ref={this.leftMenuExRef} getMenu={(name) => this.getMenu(name)} />
            </>
        );
    }
}
