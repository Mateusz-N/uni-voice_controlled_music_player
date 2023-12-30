import { useState, Fragment } from 'react';

import { setPropertyByString } from 'common/auxiliaryFunctions';

import EditButton from 'components/EditButton';
import DetailEditForm from 'components/DetailEditForm';

import Styles from 'components/OverviewPanel/OverviewPanelDetail.module.scss';

const OverviewPanelDetail = (props) => {
    const ExternalStyles = props.styles;

    // #region Zmienne stanu (useState Hooks)
    const [itemData, setItemData] = useState(props.item);
    const [editModeActive, setEditModeActive] = useState(itemData.input.excludeControls);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
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
    // #endregion

    const wrapDetail = (children) => {
        if(props.standalone) {
            return <Fragment>{children}</Fragment>
        }
        return <li className = {Styles.overviewPanelDetails_detail}>{children}</li>
    }

    // #region Przypisanie dynamicznych elementów komponentu
    let span_itemName =
        <span className = {Styles.overviewPanelDetails_detailName}>{itemData.name}: </span>;
    if((props.hideItemName === 'whileEditing' && editModeActive) || props.hideItemName === 'always' || (props.customNullValueMessage && props.customNullValueMessage.hideItemName && itemData.content.length === 0)) {
        span_itemName = null;
    }
    let node_itemContent;
    let node_itemContent_customAttributes = {};
    let ItemContentTag = 'span';
    let itemContent = itemData.content;
    if(props.customItemContentNode) {
        ItemContentTag = props.customItemContentNode.tagName;
        node_itemContent_customAttributes = props.customItemContentNode.attributes;
    }
    if(props.customNullValueMessage && itemData.content.length === 0) {
        node_itemContent_customAttributes = {...node_itemContent_customAttributes, ...props.customNullValueMessage.attributes};
        itemContent = props.customNullValueMessage.message;
    }
    node_itemContent =
        <ItemContentTag
            className = {Styles.overviewPanelDetails_detailContent}
            {...node_itemContent_customAttributes}
        >
            {itemContent}
        </ItemContentTag>

    const form_item = 
        <DetailEditForm
            detail = {itemData.name}
            defaultValue = {itemData.content}
            placeholder = {itemData.placeholder}
            inputType = {itemData.input.type}
            onSubmit = {(event, detailValue) => handleSubmitEditForm(event, 'content', detailValue)}
            onCancel = {(event) => handleCancelEditForm(event)}
            styles = {ExternalStyles}
            inputAttributes = {itemData.input.attributes}
            inputChildren = {itemData.input.children}
            excludeControls = {itemData.input.excludeControls}
        />

    let editBtn = null;
    if(!editModeActive && itemData.editable && ['text', 'textarea'].includes(itemData.input.type)) {
        editBtn = <EditButton detailName = {itemData.name} onEnableEditMode = {handleEnableEditMode} styles = {ExternalStyles} />;
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        wrapDetail(
            <>
                {editBtn}
                {span_itemName}
                {editModeActive ? form_item : node_itemContent}
            </>
        )
    );
    // #endregion
}

export default OverviewPanelDetail;