import Styles from 'components/ListBox.module.scss';

const ListBox = (props) => {
    const options = props.options;

    const handleSelection = (event) => {
        const selectedValues = Array.from(event.target.selectedOptions).map(option => option.value);
        props.onSelection(selectedValues);
    }

    return(
        <select size = {props.size || 10} multiple = {true} onChange = {handleSelection} className = {Styles.listBox}>
            {options.map((option, index) => {
                return <option key = {index} value = {option.id}>{option.name}</option>
            })}
        </select>
    );
}

export default ListBox;