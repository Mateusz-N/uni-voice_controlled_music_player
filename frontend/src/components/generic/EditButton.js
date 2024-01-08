import btn_edit from 'resources/btn_edit.svg';

import Styles from 'components/generic/EditButton.module.scss';

const EditButton = (props) => {
    // #region Zmienne globalne
    const ExternalStyles = props.styles;
    const detailName = props.detailName;
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <img
            src = {btn_edit}
            alt = 'Edit'
            id = {ExternalStyles['btnEdit_item' + detailName]}
            className = {Styles.btnEdit}
            onClick = {props.onEnableEditMode}
        />
    );
    // #endregion
}

export default EditButton;