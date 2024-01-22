import { useState, useEffect } from 'react';

import ContextMenu from 'components/generic/ContextMenu';

import Styles from 'components/generic/Select.module.scss';

const Select = (props) => {
    // #region Zmienne globalne
    const defaultValue = props.defaultValue;
    const children = props.children;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [expanded, setExpanded] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultValue);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleToggleExpanded = () => {
        setExpanded(prevState => !prevState);
    }
    const handleSelection = (event) => {
        const newValue = event.target.textContent;
        setSelectedOption(newValue);
        props.onSelection(newValue);
        handleToggleExpanded();
    }
    const handleClickOutsideSelect = (event) => {
        if(expanded && !event.target.className.includes(Styles.option_default)) {
            setExpanded(false);
        }
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        document.body.addEventListener('click', handleClickOutsideSelect);
        return () => {
            document.body.removeEventListener('click', handleClickOutsideSelect);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[expanded]);
    useEffect(() => {
        setSelectedOption(defaultValue);
    },[defaultValue]);
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let childNodes = children.map((child, index) => {
        const nodeType = Object.keys(child)[0];
        return <li key = {index} className = {Styles[nodeType]} onClick = {(event) => handleSelection(event)}>{child[nodeType].content}</li>
    });
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <div className = {Styles.select}>
            <div className = {Styles.option_default + ' ' + Styles.option} onClick = {handleToggleExpanded}>
                {selectedOption}&#x25BE;
            </div>
            <ContextMenu expanded = {expanded} context = 'select' styles = {Styles}>
                {childNodes}
            </ContextMenu>
        </div>
    );
    // #endregion
}

export default Select;