import Styles from 'components/generic/ListBox.module.scss';

const ListBox = (props) => {
    const options = props.options;
    const multiple = props.multiple;

    const handleSelection = (event) => {
        const selectedValues = Array.from(event.target.selectedOptions).map(option => option.value);
        props.onSelection(multiple ? selectedValues : selectedValues[0]);
    }

    return(
        <select size = {props.size || 10} multiple = {multiple} onChange = {handleSelection} className = {Styles.listBox}>
            {options.map((option, index) => {
                return <option key = {index} value = {option.id} title = {option.name}>{option.name}</option>
            })}
        </select>
    );
}

export default ListBox;