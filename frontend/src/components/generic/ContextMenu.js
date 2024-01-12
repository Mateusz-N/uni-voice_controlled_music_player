import { useRef, cloneElement, Children } from 'react';

import Styles from 'components/generic/ContextMenu.module.scss';

const ContextMenu = (props) => {
    // #region Zmienne globalne
    const context = props.context;
    const ExternalStyles = props.styles;
    // #endregion

    // #region Zmienne referencji (useRef Hooks)
    const contextMenu_options = useRef(null);
    // #endregion

    // #region Wstępne przetworzenie właściwości (props)
    const children = [];
    Children.forEach(props.children, (option, index) => {
        if(option !== null) {
            children.push(cloneElement(option, {
                key: index,
                className: ExternalStyles[context + '_contextMenu_option']
                    + ' ' + Styles.contextMenu_option
                    + (option.props.dangerous ? (' ' + Styles.contextMenu_option_dangerous) : '')
            }));
        }
    });
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <menu
            id = {ExternalStyles[context + '_contextMenu']}
            className = {Styles.contextMenu + ' ' + ExternalStyles[context + '_contextMenu']}
            style = {{maxHeight: props.expanded ? contextMenu_options.current.offsetHeight : 0}}
        >
            <ul id = {ExternalStyles[context + '_contextMenu_options']} className = {Styles.contextMenu_options} ref = {contextMenu_options}>
                {children}
            </ul>
        </menu>
    );
    // #endregion
}

export default ContextMenu;