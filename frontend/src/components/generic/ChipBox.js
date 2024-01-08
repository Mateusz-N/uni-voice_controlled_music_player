import btn_chipRemove from 'resources/btn_chipRemove.svg';
import btn_chipAdd from 'resources/btn_chipAdd.svg';

import Styles from 'components/generic/ChipBox.module.scss';

const ChipBox = (props) => {
    // #region Zminne globalne
    const chips = props.chips;
    const placeholder = props.placeholder;
    const context = props.context;
    const ExternalStyles = props.styles;
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let placeholderText = null;
    if(chips.length === 0) {
        placeholderText = <p id = {Styles.placeholder}>{placeholder}</p>;
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <div className = {Styles.chipBox} id = {ExternalStyles['chipBox_' + context]}>
            <img src = {btn_chipAdd} alt = 'Add' className = {Styles.btn_chipAdd + ' ' + ExternalStyles.btn_chipAdd} onClick = {props.onAddChip} />
            {placeholderText}
            {chips.map((chip, index) => {
                return(
                    <div key = {index} className = {Styles.chip + ' ' + ExternalStyles['chip_' + context]}>
                        <img
                            src = {btn_chipRemove}
                            alt = 'Remove'
                            className = {Styles.chip_btnRemove + ' ' + ExternalStyles['chip_btnRemove_' + context]}
                            onClick = {() => props.onRemoveChip(chip.id)}
                        />
                        <p className = {Styles.chipText + ' ' + ExternalStyles['chipText_' + context]} title = {chip.text}>{chip.text}</p>
                    </div>
                );
            })}
        </div>
    );
    // #endregion
}

export default ChipBox;