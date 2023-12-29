import { useState } from 'react';

import Styles from 'components/Select.module.scss';
import ContextMenu from './ContextMenu';

const Select = (props) => {
    const children = props.children;

    const [collapsed, setCollapsed] = useState(true);
    const [selectedOption, setSelectedOption] = useState(props.defaultValue);

    const handleToggleCollapsed = () => {
        setCollapsed(prevState => !prevState);
    }
    const handleSelection = (event) => {
        const newValue = event.target.textContent;
        setSelectedOption(newValue);
        props.onSelection(newValue);
        handleToggleCollapsed();
    }

    let childNodes = children.map((child, index) => {
        const nodeType = Object.keys(child)[0];
        return <li key = {index} className = {Styles[nodeType]} onClick = {(event) => handleSelection(event)}>{child[nodeType].content}</li>
    });

    return(
        <>
            <div className = {Styles.option_default + ' ' + Styles.option} onClick = {handleToggleCollapsed}>
                {selectedOption}&#x25BE;
            </div>
            <ContextMenu expanded = {!collapsed} context = 'select' styles = {Styles}>
                {childNodes}
            </ContextMenu>
        </>
    );
}

export default Select;