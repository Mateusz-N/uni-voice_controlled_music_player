import { requestDeletePlaylist } from 'common/serverRequests';

import KebabMenu from 'components/generic/KebabMenu';

const PlaylistKebabMenu = (props) => {
    const playlistID = props.playlistID;
    const context = props.context;
    const ExternalStyles = props.styles;

    const handleDeletePlaylist = () => {
        requestDeletePlaylist(playlistID, (data) => {
            props.onDeletePlaylist();
        });
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