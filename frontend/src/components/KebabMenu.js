import { useState, Fragment } from 'react';

import btn_kebab from 'resources/btn_kebab.svg';

import ContextMenu from "components/ContextMenu";

import Styles from 'components/KebabMenu.module.scss';

const KebabMenu = (props) => {
    const ExternalStyles = props.styles || Styles;
    const context = props.context;
    const children = props.children;
    const btnID = props.kebabBtnID;

    if(children == null) {
        throw new Error('The KebabMenu component must include child elements!');
    }
    if(btnID == null) {
        throw new Error('The KebabMenu component must include a non-null kebabBtnID attribute!');
    }

    const [itemContextMenuExpanded, setItemContextMenuExpanded] = useState(false);

    const handleToggleItemContextMenu = () => {
        setItemContextMenuExpanded(prevState => !prevState);
    }
    document.body.addEventListener('click', (event) => {
        if(itemContextMenuExpanded && event.target !== document.getElementById(btnID)) {
            setItemContextMenuExpanded(false);
        }
    });

    return(
        <Fragment>
            <img src = {btn_kebab} alt = 'Menu' id = {btnID} className = {Styles.btnKebab + ' ' + ExternalStyles[context + '_btnKebab']} onClick = {handleToggleItemContextMenu} />
            <ContextMenu expanded = {itemContextMenuExpanded} context = {context} styles = {ExternalStyles}>
                {children}
            </ContextMenu>
        </Fragment>
    )
}

export default KebabMenu;