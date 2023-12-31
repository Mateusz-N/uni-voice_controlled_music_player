import { useNavigate } from 'react-router-dom';

import KebabMenu from 'components/KebabMenu';

const PlaylistKebabMenu = (props) => {
    const playlistID = props.playlistID;
    const context = props.context;
    const ExternalStyles = props.styles;

    const navigate = useNavigate();

    const handleDeletePlaylist = () => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/playlist/${playlistID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then((response) => {
                if(response.ok) {
                    return response.json();
                }
                if(response.status === 401) {
                    throw new Error('Invalid access token!');
                }
            })
            .then((data) => {
                props.onDeletePlaylist();
            })
            .catch(console.error);
    }

    let optionDeletePlaylist = null;
    if(playlistID !== '2') {
        optionDeletePlaylist =
            <li id = {ExternalStyles[context + '_contextMenu_deletePlaylist']} dangerous = 'true' onClick = {handleDeletePlaylist}>Delete playlist</li>
    }

    return(
        <KebabMenu context = {context} styles = {ExternalStyles} kebabBtnID = {context + '_btnKebab_' + playlistID}>
            <li id = {ExternalStyles[context + '_contextMenu_addTracks']}>Add tracks</li>
            {optionDeletePlaylist}
        </KebabMenu>
    );
}

export default PlaylistKebabMenu;