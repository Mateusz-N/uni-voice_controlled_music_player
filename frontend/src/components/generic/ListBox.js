import { useEffect, useRef } from 'react';

import { toVoiceCommand } from 'common/auxiliaryFunctions';

import Loading from 'components/generic/Loading';

import Styles from 'components/generic/ListBox.module.scss';

const ListBox = (props) => {
    // #region Zmienne globalne
    const defaultSelectAction = props.defaultSelectAction;
    const options = props.options;
    const multiple = props.multiple;
    let size = props.size;
    if(!size) {
        size = 10;
    }
    else if(size < 2) {
        size = 2;
    }
    // #endregion

    const ref_select = useRef(null);

    // #region Obsługa zdarzeń (Event Handlers)
    const handleSelection = (event) => {
        const selectedValues = Array.from(event.target.selectedOptions).map(option => option.value);
        props.onSelection(multiple ? selectedValues : selectedValues[0]);
    }
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let loadingIcon = null;
    if(props.loading) {
        loadingIcon = <Loading />
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(!multiple || !ref_select.current) {
            return;
        }
        const itemIdentifier = defaultSelectAction.itemIdentifier;
        const action = defaultSelectAction.action;
        let matchedOption = options[parseInt(itemIdentifier) - 1];
        if(isNaN(itemIdentifier)) {
            matchedOption = options.find(option => toVoiceCommand(option.name) === itemIdentifier);
        }
        if(!matchedOption) {
            return;
        }
        ref_select.current.options[options.indexOf(matchedOption)].selected = (action === 'select');
        props.onSelection(Array.from(ref_select.current.selectedOptions).map(option => option.value));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[defaultSelectAction]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <main className = {Styles.listBox_container}>
            {loadingIcon}
            <select size = {size} multiple = {multiple} onChange = {handleSelection} className = {Styles.listBox} ref = {ref_select}>
                {options.map((option, index) => {
                    return <option key = {index} value = {option.id} title = {option.name}>{option.name}</option>
                })}
            </select>
        </main>
    );
    // #endregion
}

export default ListBox;