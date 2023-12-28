import { useState } from 'react';
import Cookies from 'js-cookie';

import { millisecondsToFormattedTime } from 'common/auxiliaryFunctions';

import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar';
import PlaybackPanel from 'components/PlaybackPanel';
import CatalogBrowser from 'components/CatalogBrowser';
import TrackList from 'components/TrackList';
import OverviewPanel from 'components/OverviewPanel';

const PlaylistBuilder = () => {
    const placeholderPlaylist = {
        id: 'unknown',
        name: 'Unknkown playlist',
        thumbnailSrc: placeholderAlbumCoverSrc,
        description: '',
        totalDuration_ms: 'N/A',
        artists: [],
        tracks: [],
        owner: 'N/A',
        public: 'N/A',
        detailsToDisplay: [{
            name: 'Track count',
            content: 0,
            editable: false,
            dataType: 'number',
            inputOptions: {}
        }, {
            name: 'Total Duration',
            content: millisecondsToFormattedTime(0),
            editable: false,
            dataType: 'number',
            inputOptions: {}
        }, {
            name: 'Owner',
            content: Cookies.get('userName') || 'Guest',
            editable: false,
            dataType: 'text',
            inputOptions: {}
        }, {
            name: 'Public',
            content: 'yes',
            editable: true,
            dataType: 'checkbox',
            inputOptions: {checked: 'true'}
        }]
    };

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
                <OverviewPanel data = {playlist} for = 'playlist' mode = 'modify' />
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