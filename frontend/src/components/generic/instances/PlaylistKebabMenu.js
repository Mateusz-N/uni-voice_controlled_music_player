import { useState } from 'react';
import { createPortal } from 'react-dom';

import { requestDeletePlaylist } from 'common/serverRequests';

import ConfirmModal from 'components/generic/ConfirmModal';
import KebabMenu from 'components/generic/KebabMenu';

import Styles from 'components/generic/instances/PlaylistKebabMenu.module.scss';

const PlaylistKebabMenu = (props) => {
    // #region Zmienne globalne
    const playlistID = props.playlistID;
    const playlistName = props.playlistName;
    const context = props.context;
    const ExternalStyles = props.styles;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [modal_confirmDeletePlaylist_open, setModal_confirmDeletePlaylist_open] = useState(false);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleSelectDeletePlaylist = () => {
        setModal_confirmDeletePlaylist_open(true);
    }
    const handleModalClose_confirmDeletePlaylist = () => {
        setModal_confirmDeletePlaylist_open(false);
    }
    const handleDeletePlaylist = () => {
        requestDeletePlaylist(playlistID, () => {
            props.onDeletePlaylist();
        });
        handleModalClose_confirmDeletePlaylist();
    }
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let optionDeletePlaylist = null;
    if(playlistID !== '2') {
        optionDeletePlaylist =
            <li id = {ExternalStyles[context + '_contextMenu_deletePlaylist']} dangerous = 'true' onClick = {handleSelectDeletePlaylist}>Delete playlist</li>
    }
    let modal_confirmDeletePlaylist = null;
    if(modal_confirmDeletePlaylist_open) {
        modal_confirmDeletePlaylist =
            createPortal(
                <ConfirmModal
                    title = {`Deleting playlist`}
                    context = {'deletePlaylist_' + playlistID}
                    onSubmit = {handleDeletePlaylist}
                    onCancel = {handleModalClose_confirmDeletePlaylist}
                >
                    <p id = {Styles.modal_confirmDeletePlaylist_content}>Are you sure you want to delete <strong>{playlistName}</strong>?</p>
                </ConfirmModal>,
                document.body
            );
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <>
            {modal_confirmDeletePlaylist}
            <KebabMenu context = {context} styles = {ExternalStyles} kebabBtnID = {context + '_btnKebab_' + playlistID}>
                {/* <li id = {ExternalStyles[context + '_contextMenu_addTracks']}>Add tracks</li> */}
                {optionDeletePlaylist}
            </KebabMenu>
        </>
    );
    // #endregion
}

export default PlaylistKebabMenu;