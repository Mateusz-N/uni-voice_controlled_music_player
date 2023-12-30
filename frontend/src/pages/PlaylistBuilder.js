import { useState } from 'react';
import Cookies from 'js-cookie';

import { placeholderPlaylist } from 'common/placeholderObjects';

import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar';
import PlaybackPanel from 'components/PlaybackPanel';
import CatalogBrowser from 'components/CatalogBrowser';
import TrackList from 'components/TrackList';
import OverviewPanel from 'components/OverviewPanel/OverviewPanel';

const PlaylistBuilder = () => {
    // #region Zmienne stanu (useState Hooks)
    const [loggedIn, setLoggedIn] = useState(!!Cookies.get('userID'));
    const [playlist, setPlaylist] = useState(placeholderPlaylist);
    const [tracks, setTracks] = useState([]);

    // #region Obsługa zdarzeń (Event Handlers)
    const onLogin = () => {
        setLoggedIn(true);
    }
    const onLogout = () => {
        setLoggedIn(false);
    }
    
    // #region Struktura komponentu (JSX)
    return (
        <div id = 'page'>
            <NavBar handleLogin = {onLogin} handleLogout = {onLogout} />
            <CatalogBrowser className = 'playlistBrowser hasOverviewPanel'>
                <TrackList tracks = {tracks} for = 'playlist' />
                <OverviewPanel key = {playlist.id} data = {playlist} for = 'playlist' />
            </CatalogBrowser>
            <PlaybackPanel track = {{
                duration_ms: '15000',
                trackTitle: 'Song',
                artists: ['Artist'],
                albumTitle: 'Album',
                albumCoverSrc: placeholderAlbumCoverSrc
            }} />
        </div>
    );
    // #endregion
}

export default PlaylistBuilder;