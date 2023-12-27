import { useRef, cloneElement } from 'react';

import Styles from 'components/ContextMenu.module.scss';

const ContextMenu = (props) => {
    const contextMenu_options = useRef(null);

    const ExternalStyles = props.styles;
    const children = [];
    props.children.forEach((option, index) => {
        children.push(cloneElement(option, {
            key: index,
            className: Styles[props.context + '_contextMenu_option'] + ' ' + Styles.contextMenu_option + (option.props.dangerous ? (' ' + Styles.contextMenu_option_dangerous) : '')
        }));
    });
    
    return(
        <menu id = {ExternalStyles[props.context + '_contextMenu']} className = {Styles.contextMenu} style = {{maxHeight: props.expanded ? contextMenu_options.current.offsetHeight : 0}}>
            <ul id = {ExternalStyles[props.context + '_contextMenu_options']} className = {Styles.contextMenu_options} ref = {contextMenu_options}>
                {children}
            </ul>
        </menu>
    );
}

export default ContextMenu;