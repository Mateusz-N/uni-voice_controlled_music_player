import { useState } from 'react';

import { requestAddTrackToPlaylist } from 'common/serverRequests';

import Modal from 'components/generic/Modal';
import ListBox from 'components/generic/ListBox';
import FormControlSection from 'components/generic/FormControlSection';

import Styles from 'components/generic/instances/AddTrackToPlaylistsModal.module.scss';

const AddTrackToPlaylistModal = (props) => {
    const index = props.index;
    const track = props.track;
    const userPlaylists = props.userPlaylists;

    const [selectedPlaylists, setSelectedPlaylists] = useState([]);

    const handleSelectPlaylists = (playlistIDs) => {
        setSelectedPlaylists(playlistIDs)
    }
    const addTrackToPlaylist = (playlistID) => {
        requestAddTrackToPlaylist(playlistID, [`spotify:track:${track.id}`], (data) => {
            console.info(data.message);
        });
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

    return(
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
    );
}

export default AddTrackToPlaylistModal;