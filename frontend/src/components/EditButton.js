import btn_edit from 'resources/btn_edit.svg';

const EditButton = (props) => {
    const ExternalStyles = props.styles;
    return(
        <img
            src = {btn_edit}
            alt = 'Edit'
            className = {ExternalStyles.btn_edit}
            onClick = {props.onEnableEditMode}
        />
    );
}

export default EditButton;