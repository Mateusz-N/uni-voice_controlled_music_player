import { useState } from 'react';
import { createPortal } from 'react-dom';

import KebabMenu from 'components/generic/KebabMenu';
import ArtistDetailsModal from 'components/OverviewPanel/ArtistDetailsModal';

import Styles from 'components/OverviewPanel/ArtistKebabMenu.module.scss';

const ArtistKebabMenu = (props) => {
    // #region Zmienne globalne
    const artist = props.artist;
    const context = props.context;
    const ExternalStyles = props.styles;
    // #endregion
    
    // #region Zmienne stanu (useState Hooks)
    const [modal_artistDetails_open, setModal_artistDetails_open] = useState(false);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleSelectArtistDetails = () => {
        setModal_artistDetails_open(true);
    }
    const handleModalClose_artistDetails = () => {
        setModal_artistDetails_open(false);
    }
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let modal_artistDetails = null;
    if(modal_artistDetails_open) {
        modal_artistDetails =
            createPortal(<ArtistDetailsModal
                index = {artist.id}
                artist = {artist}
                onClose = {handleModalClose_artistDetails}
            />, document.body);
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <>
            {modal_artistDetails}
            <KebabMenu context = {context} styles = {ExternalStyles} kebabBtnID = {context + '_btnKebab_' + artist.id}>
                <li id = {Styles.artistList_item_contextMenu_artistDetails} onClick = {handleSelectArtistDetails}>Artist details</li>
            </KebabMenu>
        </>
    );
    // #endregion
}

export default ArtistKebabMenu;