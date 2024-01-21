import { useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import { requestGetPlaylist, requestGetTracksSavedStatus } from 'common/serverRequests';
import { placeholderPlaylist } from 'common/placeholderObjects';
import { millisecondsToFormattedTime } from 'common/auxiliaryFunctions';

import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';
import savedTracksAlbumCoverSrc from 'resources/albumCover_savedTracks.png';

import NavBar from 'components/NavBar/NavBar';
import CatalogBrowser from 'components/CatalogBrowser';
import TrackList from 'components/TrackList/TrackList';
import OverviewPanel from 'components/OverviewPanel/OverviewPanel';
import Toast from 'components/generic/Toast';

const Playlist = (props) => {
    // #region Zmienne globalne
    const defaultPlaybackState = props.defaultPlaybackState;
    const defaultFormAction = props.defaultFormAction;
    const defaultSearchQuery = props.defaultSearchQuery;
    const playlistID = window.location.href.split('/').pop();
    const playingTrack = props.playingTrack;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [playlist, setPlaylist] = useState(placeholderPlaylist);
    const [playlistLoading, setPlaylistLoading] = useState(false);
    const [deletionRequested, setDeletionRequested] = useState(false);
    const [notification, setNotification] = useState({});
    // #endregion

    // #region Zmienne lokalizacji (useLocation Hooks)
    const location = useLocation();
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleLogin = () => {
        getPlaylist();
    }
    const handleLogout = () => {
        getPlaylist();
    }
    const handlePlaylistUpdate = () => {
        setTimeout(getPlaylist, 100); // Odczekaj chwilę, dopóki Spotify nie zaktualizuje swojej bazy danych
    }
    const handleGetPlaylistApiResponse = async (data) => {
        let fetchedPlaylist = playlistID.toString() === '2' ? { // '2' === Polubione utwory
            id: playlistID,
            name: 'Saved tracks',
            thumbnailSrc: savedTracksAlbumCoverSrc,
            description: '',
            totalDuration_ms: data.items.reduce((totalDuration_ms, item) => totalDuration_ms + (item.track.duration_ms.totalMilliseconds || item.track.duration_ms), 0),
            tracks: data.items.map(item => ({
                id: item.track.id || -1,
                number: item.track.track_number,
                title: item.track.name,
                artists: item.track.artists,
                album: item.track.album,
                duration_ms: item.track.duration_ms.totalMilliseconds || item.track.duration_ms,
                genres: [], // Spotify API obecnie nie dostarcza gatunków utworów w punkcie końcowym pobierania list odtwarzania
                saved: null,
                dateAdded: item.added_at,
                explicit: item.track.explicit,
                playable: item.track.is_playable,
                local: item.track.is_local
            })),
            owner: Cookies.get('userName'),
            public: false,
            collaborative: false
        }
        :
        {
            id: data.id,
            name: data.name,
            thumbnailSrc: (data.images && data.images.length > 0 ? data.images[0].url : placeholderAlbumCoverSrc),
            description: data.description,
            totalDuration_ms: data.tracks.items.reduce((totalDuration_ms, item) => totalDuration_ms + (item.track.duration_ms.totalMilliseconds || item.track.duration_ms), 0),
            artists: data.artists,
            tracks: data.tracks.items.map(item => ({
                id: item.track.id || -1,
                number: item.track.track_number,
                title: item.track.name,
                artists: item.track.artists,
                album: item.track.album,
                duration_ms: item.track.duration_ms.totalMilliseconds || item.track.duration_ms,
                genres: [],
                saved: null,
                dateAdded: item.added_at,
                explicit: item.track.explicit,
                playable: item.track.is_playable,
                local: item.track.is_local
            })),
            owner: data.owner.display_name,
            public: data.public,
            collaborative: data.collaborative
        }
        fetchedPlaylist.detailsToDisplay = [{
            name: 'Name',
            content: fetchedPlaylist.name || '',
            editable: playlistID.toString() !== '2',
            showSeparately: true,
            input: {
                type: 'text',
                attributes: {placeholder: 'Playlist name'},
                excludeControls: false,
                children: {}
            }
        }, {
            name: 'Track count',
            content: fetchedPlaylist.tracks ? fetchedPlaylist.tracks.length || 'N/A' : 'N/A',
            editable: false,
            showSeparately: false,
            input: {
                type: 'number',
                attributes: {},
                excludeControls: false,
                children: {}
            }
        }, {
            name: 'Total Duration',
            content: fetchedPlaylist.totalDuration_ms ? millisecondsToFormattedTime(fetchedPlaylist.totalDuration_ms) : 'N/A',
            editable: false,
            showSeparately: false,
            input: {
                type: 'number',
                attributes: {},
                excludeControls: false,
                children: {}
            }
        }, {
            name: 'Owner',
            content: fetchedPlaylist.owner || 'N/A',
            editable: false,
            showSeparately: false,
            input: {
                type: 'text',
                attributes: {},
                excludeControls: false,
                children: {}
            }
        }, {
            name: 'Public',
            content: (fetchedPlaylist.public === true) ? 'yes' : ((fetchedPlaylist.public === false) ? 'no' : 'N/A'),
            editable: playlistID.toString() !== '2',
            showSeparately: false,
            input: {
                type: 'select',
                attributes: {},
                excludeControls: playlistID.toString() !== '2',
                children: [{
                    option: {
                        attributes: {
                            name: 'yes',
                            value: 'yes'
                        },
                        content: 'yes'
                }}, {
                    option: {
                        attributes: {
                            name: 'no',
                            value: 'no'
                        },
                        content: 'no'
                    }
                }]
            }
        }, {
            name: 'Description',
            content: fetchedPlaylist.description || '',
            editable: playlistID.toString() !== '2',
            showSeparately: true,
            input: {
                type: 'text',
                attributes: {placeholder: 'Playlist description'},
                excludeControls: false,
                children: {}
            }
        }];
        fetchedPlaylist = await getTracksSavedStatus(fetchedPlaylist);
        setPlaylist(fetchedPlaylist);
    }
    const handleDeletePlaylistVoiceCommand = () => {
        setDeletionRequested(true);
    }
    const handleCancelDeletePlaylist = () => {
        setDeletionRequested(false);
        props.onRequestDefaultFormAction(null);
    }
    const handleSubmitAllForms = () => {
        props.onRequestDefaultFormAction('submit');
    }
    const handleCancelAllForms = () => {
        props.onRequestDefaultFormAction('cancel');
    }
    // #endregion

    // #region Funkcje pomocnicze
    const getPlaylist = (fromAPI = true) => {
    /*  UWAGA: Właściwości listy odtwarzania mogą być nieaktualne, jeśli niedawno miała miejsce aktualizacja.
        Jest to prawdopodobnie defekt w punkcie końcowym 'Get Playlist' Spotify API.
        Np. punkt końcowy 'Get User's Playlists' wyświetla aktualną nazwę listy, a 'Get Playlist' nie. */
        const loggedIn = !!Cookies.get('userID');
        if(!loggedIn) {
            setPlaylist(placeholderPlaylist);
            return;
        }
        setPlaylistLoading(true);
        requestGetPlaylist(playlistID, handleGetPlaylistApiResponse, () => setPlaylistLoading(false), fromAPI);
    }
    const getTracksSavedStatus = async (playlist) => {
        const trackList = playlist.tracks;
        let groupsOf50 = [];
        for(let i = 0; i < trackList.length; i += 50) {
            groupsOf50.push(trackList.slice(i, i + 50));
        }
        for await(const group of groupsOf50) {
            const idArray = [];
            for(const track of group) {
                if(track.id && track.id !== -1) {
                    idArray.push(track.id)
                }
            };
            await requestGetTracksSavedStatus(idArray.join(','), (data) => {
                group.map((track, index) => track.saved = data[index]);
            });
        }
        return playlist;
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        getPlaylist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() => {
        if(location.state && location.state.notificationMessage) {
            setNotification({message: location.state.notificationMessage, type: location.state.notificationType});
            window.history.replaceState({}, document.title);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let toastNotification = null;
    if(notification.message) {
        toastNotification =
            createPortal(<Toast
                message = {notification.message}
                type = {notification.type} 
                onAnimationEnd = {() => setNotification({})}
            />, document.body);
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return (
        <div id = 'page'>
            {toastNotification}
            <NavBar
                defaultSearchQuery = {defaultSearchQuery}
                onLogin = {handleLogin}
                onLogout = {handleLogout}
                onTogglePlaylistPlaybackVoiceCommand = {props.onRequestDefaultPlaylistPlaybackState}
                onSearch = {() => props.onRequestDefaultSearchQuery(null)}
                onSearchVoiceCommand = {(query) => props.onRequestDefaultSearchQuery(query)}
                onDeletePlaylistVoiceCommand = {handleDeletePlaylistVoiceCommand}
                onSubmitFormVoiceCommand = {handleSubmitAllForms}
                onCancelFormVoiceCommand = {handleCancelAllForms}
            />
            <CatalogBrowser className = 'playlistBrowser hasOverviewPanel'>
                <TrackList
                    key = {'trackList' + playlist.id}
                    tracks = {playlist.tracks}
                    playingTrack = {playingTrack}
                    for = 'playlist'
                    playlist = {playlist}
                    playlistLoading = {playlistLoading}
                    onPlaybackToggle = {props.onPlaybackToggle}
                    onPlaylistUpdate = {handlePlaylistUpdate}
                />
                <OverviewPanel
                    key = {'overviewPanel' + playlist.id}
                    data = {playlist}
                    for = 'playlist'
                    playingTrack = {playingTrack}
                    defaultPlaybackState = {defaultPlaybackState}
                    requestDelete = {deletionRequested}
                    defaultFormAction = {defaultFormAction}
                    onPlaybackToggle = {props.onPlaylistPlaybackToggle}
                    onCancelDeletePlaylist = {handleCancelDeletePlaylist}
                />
            </CatalogBrowser>
        </div>
    );
    // #endregion
}

export default Playlist;