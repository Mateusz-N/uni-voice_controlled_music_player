import { useState } from 'react';

import Modal from 'components/Modal';
import ListBox from 'components/ListBox';

import Styles from 'components/AddTrackToPlaylistsModal.module.scss';

const AddTrackToPlaylistModal = (props) => {
    const index = props.index;
    const track = props.track;
    const userPlaylists = props.userPlaylists;
    const open = props.open;

    const [selectedPlaylists, setSelectedPlaylists] = useState([]);

    const handleSelectPlaylists = (playlistIDs) => {
        setSelectedPlaylists(playlistIDs)
    }
    const addTrackToPlaylist = (playlistID) => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/playlist/${playlistID}/tracks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: [`spotify:track:${track.id}`]
            }),
            credentials: 'include'
        })
            .then((response) => {
                if(response.ok) {
                    return response.json();
                }
            })
            .then((data) => {
                console.info(data.message);
            })
            .catch(console.error);
    }
    const handleSubmitAddToPlaylistForm = (event) => {
        event.preventDefault();
        selectedPlaylists.forEach(playlist => addTrackToPlaylist(playlist));
    }
    const handleCancelAddToPlaylistForm = () => {
        props.onClose();
    }

    return(
        <Modal key = {track.id} open = {open} id = {'trackList_item_addToPlaylist_' + index} onClose = {props.onClose}>
            <p>Select playlists</p>
            <form id = {Styles.form_addToPlaylist} onSubmit = {handleSubmitAddToPlaylistForm}>
                <ListBox
                    options = {userPlaylists}
                    onSelection = {(selectedPlaylistIDs) => handleSelectPlaylists(selectedPlaylistIDs)}>
                </ListBox>
                <section className = 'formControlSection'>
                    <button id = {Styles.btnCancel_addToPlaylist} className = {Styles.btnCancel + ' btnSecondary'} onClick = {handleCancelAddToPlaylistForm} type = 'button'>Cancel</button>
                    <button id = {Styles.btnSubmit_addToPlaylist} className = {Styles.btnSubmit + ' btnPrimary'} onClick = {handleSubmitAddToPlaylistForm}>Apply</button>
                </section>
            </form>
        </Modal>
    );
}

export default AddTrackToPlaylistModal;