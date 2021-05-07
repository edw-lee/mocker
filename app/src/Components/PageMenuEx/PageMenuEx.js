import React from 'react';
import { MenuListPlus } from '../Common'
import './css/PageMenuEx.scss';

export function PageMenuEx(props) {        
    const parent = props.parent;
    const pages = props.pages;    

    const { currentPage, setCurrentPage } = parent.props;

    const pageEls = pages.map(page => {        
        if (page.name !== currentPage)
            return <li key={page.name} onClick={() => setCurrentPage(page.name)}>{page.name}</li>
        else
            return <li key={page.name} className='selected'>{page.name}</li>
    });

    return (
        <MenuListPlus className='pages-menu' addFunction={parent.addPage}>
            {pageEls.length ? pageEls : <span className='no-page-txt'>No page found.</span>}
        </MenuListPlus>
    );
}