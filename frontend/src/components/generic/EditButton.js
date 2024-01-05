import btn_edit from 'resources/btn_edit.svg';

import Styles from 'components/generic/EditButton.module.scss';

const EditButton = (props) => {
    const ExternalStyles = props.styles;
    const detailName = props.detailName;

    return(
        <img
            src = {btn_edit}
            alt = 'Edit'
            id = {ExternalStyles['btnEdit_item' + detailName]}
            className = {Styles.btnEdit}
            onClick = {props.onEnableEditMode}
        />
    );
}

export default EditButton;