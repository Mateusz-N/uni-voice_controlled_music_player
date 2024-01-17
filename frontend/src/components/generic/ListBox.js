import Loading from 'components/generic/Loading';

import Styles from 'components/generic/ListBox.module.scss';

const ListBox = (props) => {
    // #region Zmienne globalne
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

    // #region Struktura komponentu (JSX)
    return(
        <main className = {Styles.listBox_container}>
            {loadingIcon}
            <select size = {size} multiple = {multiple} onChange = {handleSelection} className = {Styles.listBox}>
                {options.map((option, index) => {
                    return <option key = {index} value = {option.id} title = {option.name}>{option.name}</option>
                })}
            </select>
        </main>
    );
    // #endregion
}

export default ListBox;