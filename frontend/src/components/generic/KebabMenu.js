import { useState, useEffect, Fragment } from 'react';

import btn_kebab from 'resources/btn_kebab.svg';

import ContextMenu from "components/generic/ContextMenu";

import Styles from 'components/generic/KebabMenu.module.scss';

const KebabMenu = (props) => {
    // #region Zmienne globalne
    const ExternalStyles = props.styles || Styles;
    const context = props.context;
    const children = props.children;
    const btnID = props.kebabBtnID;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [itemContextMenuExpanded, setItemContextMenuExpanded] = useState(false);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleToggleItemContextMenu = () => {
        setItemContextMenuExpanded(prevState => !prevState);
    }
    const handleClickOutsideMenu = (event) => {
        if(itemContextMenuExpanded && event.target !== document.getElementById(btnID)) {
            setItemContextMenuExpanded(false);
        }
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(children == null) {
            return;
        }
        if(btnID == null) {
            throw new Error('The KebabMenu component must include a non-null kebabBtnID attribute!');
        }
        if(itemContextMenuExpanded && props.onExpand) {
            props.onExpand();
        }
        else if(!itemContextMenuExpanded && props.onCollapse) {
            props.onCollapse();
        }
        document.body.addEventListener('click', handleClickOutsideMenu);
        return () => {
            document.body.removeEventListener('click', handleClickOutsideMenu);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[itemContextMenuExpanded])
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <Fragment>
            <img src = {btn_kebab} alt = 'Menu' id = {btnID} className = {Styles.btnKebab + ' ' + ExternalStyles[context + '_btnKebab']} onClick = {handleToggleItemContextMenu} />
            <ContextMenu expanded = {itemContextMenuExpanded} context = {context} styles = {ExternalStyles}>
                {children}
            </ContextMenu>
        </Fragment>
    );
    // #endregion
}

export default KebabMenu;