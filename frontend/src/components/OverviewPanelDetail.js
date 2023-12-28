import { useState } from 'react';

import Styles from 'components/OverviewPanelDetail.module.scss';
import EditButton from 'components/EditButton';
import DetailEditForm from 'components/DetailEditForm';

const OverviewPanelDetail = (props) => {
    const item = props.item;

    const [itemData, setItemData] = useState(item);
    const [editModeActive, setEditModeActive] = useState(false);

    const handleEnableEditMode = () => {
        setEditModeActive(true);
    }
    const handleDisableEditMode = () => {
        setEditModeActive(false);
    }
    const handleSubmitEditForm = (event, detailValue) => {
        event.preventDefault();
        setItemData(prevState => {
            const clone = structuredClone(prevState);
            clone.content = detailValue;
            return clone;
        });
        handleDisableEditMode();
    }
    const handleCancelEditForm = (event) => {
        event.preventDefault();
        handleDisableEditMode();
    }

    const span_item =
        <span className = {Styles.overviewPanelDetails_detailContent}>{itemData.content}</span>
    const form_item = 
        <DetailEditForm
            detail = {itemData.name}
            defaultValue = {itemData.content}
            inputType = {itemData.dataType}
            onSubmit = {(event, detailValue) => handleSubmitEditForm(event, detailValue)}
            onCancel = {(event) => handleCancelEditForm(event)}
            styles = {Styles}
            inputOptions = {item.inputOptions}
        />

    return(
        <li className = {Styles.overviewPanelDetails_detail}>
            {editModeActive || !itemData.editable ? null : <EditButton onEnableEditMode = {handleEnableEditMode} styles = {Styles} />}
            <span className = {Styles.overviewPanelDetails_detailName}>{itemData.name}: </span>
            {editModeActive ? form_item : span_item}
        </li>
    );
}

export default OverviewPanelDetail;