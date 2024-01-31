import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { capitalizeFirstLetter } from 'common/auxiliaryFunctions';

import KebabMenu from 'components/generic/KebabMenu';
import ArtistDetailsModal from 'components/OverviewPanel/ArtistDetailsModal';
import AlbumDetailsModal from 'components/OverviewPanel/AlbumDetailsModal';

import Styles from 'components/OverviewPanel/ItemDetailsKebabMenu.module.scss';

const ItemDetailsKebabMenu = (props) => {
    // #region Zmienne globalne
    const item = props.item;
    const itemType = props.itemType;
    const defaultDisplay = props.defaultDisplay;
    const defaultFormAction = props.defaultFormAction;
    const context = props.context;
    const ExternalStyles = props.styles;
    // #endregion
    
    // #region Zmienne stanu (useState Hooks)
    const [modal_itemDetails_open, setModal_itemDetails_open] = useState(false);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleSelectItemDetails = () => {
        setModal_itemDetails_open(true);
    }
    const handleModalClose_itemDetails = () => {
        setModal_itemDetails_open(false);
        props.onItemDetailsModalClose();
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(!defaultDisplay) {
            return;
        }
        setModal_itemDetails_open(true);
    },[defaultDisplay]);
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let modal_itemDetails = null;
    if(modal_itemDetails_open) {
        if(itemType === 'artist') {
            modal_itemDetails =
                <ArtistDetailsModal
                    index = {item.id}
                    artist = {item}
                    defaultAction = {defaultFormAction}
                    onClose = {handleModalClose_itemDetails}
                />;
        }
        else if(itemType === 'album') {
            modal_itemDetails =
                <AlbumDetailsModal
                    index = {item.id}
                    album = {item}
                    defaultAction = {defaultFormAction}
                    onClose = {handleModalClose_itemDetails}
                />;
        }
        modal_itemDetails = createPortal(modal_itemDetails, document.body);
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <>
            {modal_itemDetails}
            <KebabMenu context = {context} styles = {ExternalStyles} kebabBtnID = {context + '_btnKebab_' + item.id}>
                <li id = {Styles.overviewPanel_contextMenu_itemDetails} data-cy = 'itemDetails' onClick = {handleSelectItemDetails}>
                    {capitalizeFirstLetter(itemType)} details
                </li>
            </KebabMenu>
        </>
    );
    // #endregion
}

export default ItemDetailsKebabMenu;