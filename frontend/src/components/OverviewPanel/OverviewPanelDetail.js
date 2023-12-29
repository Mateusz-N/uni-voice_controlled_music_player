import { useState } from 'react';

import { setPropertyByString } from 'common/auxiliaryFunctions';

import EditButton from 'components/EditButton';
import DetailEditForm from 'components/DetailEditForm';

import Styles from 'components/OverviewPanel/OverviewPanelDetail.module.scss';

const OverviewPanelDetail = (props) => {
    const item = props.item;

    const [itemData, setItemData] = useState(item);
    const [editModeActive, setEditModeActive] = useState(itemData.input.excludeControls);

    const handleEnableEditMode = () => {
        setEditModeActive(true);
    }
    const handleDisableEditMode = () => {
        setEditModeActive(false);
    }
    const handleSubmitEditForm = (event, targetDataPropertyReference, detailValue) => {
        event.preventDefault();
        setItemData(prevState => setPropertyByString(prevState, targetDataPropertyReference, detailValue));
        if(!itemData.input.excludeControls) {
            handleDisableEditMode();
        }
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
            inputType = {itemData.input.type}
            onSubmit = {(event, detailValue) => handleSubmitEditForm(event, 'content', detailValue)}
            onCancel = {(event) => handleCancelEditForm(event)}
            styles = {Styles}
            inputAttributes = {item.input.attributes}
            inputChildren = {item.input.children}
            excludeControls = {item.input.excludeControls}
        />

    let editBtn = null;
    if(!editModeActive && itemData.editable && itemData.dataType === 'text') {
        editBtn = <EditButton onEnableEditMode = {handleEnableEditMode} styles = {Styles} />;
    }

    return(
        <li className = {Styles.overviewPanelDetails_detail}>
            {editBtn}
            <span className = {Styles.overviewPanelDetails_detailName}>{itemData.name}: </span>
            {editModeActive ? form_item : span_item}
        </li>
    );
}

export default OverviewPanelDetail;