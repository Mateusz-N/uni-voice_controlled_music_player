import Styles from 'components/generic/ListBox.module.scss';

const ListBox = (props) => {
    // #region Zmienne globalne
    const options = props.options;
    const multiple = props.multiple;
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleSelection = (event) => {
        const selectedValues = Array.from(event.target.selectedOptions).map(option => option.value);
        props.onSelection(multiple ? selectedValues : selectedValues[0]);
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <select size = {props.size || 10} multiple = {multiple} onChange = {handleSelection} className = {Styles.listBox}>
            {options.map((option, index) => {
                return <option key = {index} value = {option.id} title = {option.name}>{option.name}</option>
            })}
        </select>
    );
    // #endregion
}

export default ListBox;