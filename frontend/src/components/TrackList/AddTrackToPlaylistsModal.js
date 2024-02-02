import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { requestAddTrackToPlaylist } from 'common/serverRequests';

import Modal from 'components/generic/Modal';
import ListBox from 'components/generic/ListBox';
import FormControlSection from 'components/generic/FormControlSection';
import Toast from 'components/generic/Toast';

import Styles from 'components/TrackList/AddTrackToPlaylistsModal.module.scss';

const AddTrackToPlaylistModal = (props) => {
    // #region Zmienne globalne
    const defaultSelectAction = props.defaultSelectAction;
    const defaultAction = props.defaultAction;
    const index = props.index;
    const track = props.track;
    const userPlaylists = props.userPlaylists;
    const context = props.context;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    // #endregion

    // #region Obsługa zdarzeń
    const handleSelectPlaylists = (playlistIDs) => {
        props.onPlaylistSelection();
        setSelectedPlaylists(playlistIDs)
    }
    const handleSubmitAddToPlaylistForm = async (event) => {
        if(event) {
            event.preventDefault();
        }
        for(const playlist of selectedPlaylists) {
            await addTrackToPlaylist(playlist);
        }
        if(context === 'playlist') {
            props.onPlaylistUpdate();
        }
        props.onClose();
    }
    const handleCancelAddToPlaylistForm = () => {
        props.onClose();
    }
    // #endregion

    // #region Funkcje pomocnicze
    const addTrackToPlaylist = async (playlistID) => {
        requestAddTrackToPlaylist(playlistID, [`spotify:track:${track.id}`], (data) => {
            const notificationMessage = data.message.type === 'success' ? 'Track added to playlist(s) successfully!' : data.message.message;
            props.onNotification({message: notificationMessage, type: data.message.type});
        });
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(defaultAction === 'submit') {
            handleSubmitAddToPlaylistForm();
            return;
        }
        if(defaultAction === 'cancel') {
            props.onClose();
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[defaultAction]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <>
            <Modal key = {track.id} title = 'Add track to playlist(s)...' id = {'trackList_item_addToPlaylist_' + index} onClose = {props.onClose} styles = {Styles}>
                <form id = {Styles.form_addToPlaylist} onSubmit = {handleSubmitAddToPlaylistForm}>
                    <ListBox
                        options = {userPlaylists}
                        multiple = {true}
                        defaultSelectAction = {defaultSelectAction}
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