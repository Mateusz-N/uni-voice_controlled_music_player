import { useState, useEffect } from 'react';

import ContextMenu from 'components/generic/ContextMenu';

import Styles from 'components/generic/Select.module.scss';

const Select = (props) => {
    const children = props.children;

    const [expanded, setExpanded] = useState(false);
    const [selectedOption, setSelectedOption] = useState(props.defaultValue);

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

    useEffect(() => {
        document.body.addEventListener('click', handleClickOutsideSelect);
        return () => {
            document.body.removeEventListener('click', handleClickOutsideSelect);
        };
    },[expanded]);

    let childNodes = children.map((child, index) => {
        const nodeType = Object.keys(child)[0];
        return <li key = {index} className = {Styles[nodeType]} onClick = {(event) => handleSelection(event)}>{child[nodeType].content}</li>
    });

    return(
        <div id = {Styles.select}>
            <div className = {Styles.option_default + ' ' + Styles.option} onClick = {handleToggleExpanded}>
                {selectedOption}&#x25BE;
            </div>
            <ContextMenu expanded = {expanded} context = 'select' styles = {Styles}>
                {childNodes}
            </ContextMenu>
        </div>
    );
}

export default Select;