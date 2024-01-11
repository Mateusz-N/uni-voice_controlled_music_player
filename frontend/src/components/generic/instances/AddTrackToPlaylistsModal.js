import { useState } from 'react';
import { createPortal } from 'react-dom';

import { requestAddTrackToPlaylist } from 'common/serverRequests';

import Modal from 'components/generic/Modal';
import ListBox from 'components/generic/ListBox';
import FormControlSection from 'components/generic/FormControlSection';
import Toast from 'components/generic/Toast';

import Styles from 'components/generic/instances/AddTrackToPlaylistsModal.module.scss';

const AddTrackToPlaylistModal = (props) => {
    // #region Zmienne globalne
    const index = props.index;
    const track = props.track;
    const userPlaylists = props.userPlaylists;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    const [notification, setNotification] = useState({});
    // #endregion

    // #region Obsługa zdarzeń
    const handleSelectPlaylists = (playlistIDs) => {
        setSelectedPlaylists(playlistIDs)
    }
    const handleSubmitAddToPlaylistForm = (event) => {
        event.preventDefault();
        selectedPlaylists.forEach(playlist => addTrackToPlaylist(playlist));
        props.onClose();
        props.onPlaylistUpdate();
    }
    const handleCancelAddToPlaylistForm = () => {
        props.onClose();
    }
    // #endregion

    // #region Funkcje pomocnicze
    const addTrackToPlaylist = (playlistID) => {
        requestAddTrackToPlaylist(playlistID, [`spotify:track:${track.id}`], (data) => {
            setNotification(data.message);
        });
    }
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let toastNotification = null;
    if(notification.message) {
        toastNotification =
            createPortal(<Toast message = {notification.message} type = {notification.type} onAnimationEnd = {() => setNotification({})} />, document.body);
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <>
            {toastNotification}
            <Modal key = {track.id} title = 'Add track to playlist(s)...' id = {'trackList_item_addToPlaylist_' + index} onClose = {props.onClose} styles = {Styles}>
                <form id = {Styles.form_addToPlaylist} onSubmit = {handleSubmitAddToPlaylistForm}>
                    <ListBox
                        options = {userPlaylists}
                        multiple = {true}
                        onSelection = {(selectedPlaylistIDs) => handleSelectPlaylists(selectedPlaylistIDs)}
                    />
                    <FormControlSection
                        context = 'addToPlaylist'
                        onSubmit = {handleSubmitAddToPlaylistForm}
                        onCancel = {handleCancelAddToPlaylistForm}
                        styles = {Styles}
                    />
                </form>
            </Modal>
        </>
    );
    // #endregion
}

export default AddTrackToPlaylistModal;