import { requestDeletePlaylist } from 'common/serverRequests';

import KebabMenu from 'components/generic/KebabMenu';

const PlaylistKebabMenu = (props) => {
    // #region Zmienne globalne
    const playlistID = props.playlistID;
    const context = props.context;
    const ExternalStyles = props.styles;
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleDeletePlaylist = () => {
        requestDeletePlaylist(playlistID, (data) => {
            props.onDeletePlaylist();
        });
    }
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let optionDeletePlaylist = null;
    if(playlistID !== '2') {
        optionDeletePlaylist =
            <li id = {ExternalStyles[context + '_contextMenu_deletePlaylist']} dangerous = 'true' onClick = {handleDeletePlaylist}>Delete playlist</li>
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <KebabMenu context = {context} styles = {ExternalStyles} kebabBtnID = {context + '_btnKebab_' + playlistID}>
            {/* <li id = {ExternalStyles[context + '_contextMenu_addTracks']}>Add tracks</li> */}
            {optionDeletePlaylist}
        </KebabMenu>
    );
    // #endregion
}

export default PlaylistKebabMenu;