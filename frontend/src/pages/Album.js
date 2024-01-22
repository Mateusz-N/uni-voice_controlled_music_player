import { Link } from 'react-router-dom';
import { useState, useEffect, Fragment } from 'react';
import Cookies from 'js-cookie';

import { requestGetAlbum, requestGetAlbumDetails } from 'common/serverRequests';
import { placeholderAlbum } from 'common/placeholderObjects';
import { millisecondsToFormattedTime } from 'common/auxiliaryFunctions';

import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar/NavBar';
import CatalogBrowser from 'components/CatalogBrowser';
import TrackList from 'components/TrackList/TrackList';
import OverviewPanel from 'components/OverviewPanel/OverviewPanel';

const Album = (props) => {
    // #region Zmienne globalne
    const defaultPlayingTrack = props.defaultPlayingTrack;
    const defaultPlaybackState = props.defaultPlaybackState;
    const defaultFormAction = props.defaultFormAction;
    const defaultSearchQuery = props.defaultSearchQuery;
    const defaultArtistDetailsDisplay = props.defaultItemDetailsDisplay;
    const albumID = window.location.href.split('/').pop();
    const playingTrack = props.playingTrack;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [album, setAlbum] = useState(placeholderAlbum);
    const [albumLoading, setAlbumLoading] = useState(false);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleLogin = () => {
        getAlbum();
    }
    const handleLogout = () => {
        getAlbum();
    }
    const handleGetAlbumApiResponse = (data) => {
        const fetchedAlbum = {
            id: albumID,
            name: data.name,
            thumbnailSrc: (data.images.length > 0 ? data.images[0].url : placeholderAlbumCoverSrc),
            totalDuration_ms: data.tracks.items.reduce((totalDuration_ms, item) => totalDuration_ms + (item.duration_ms.totalMilliseconds || item.duration_ms), 0),
            artists: data.artists,
            tracks: data.tracks.items.map(item => ({
                id: item.id,
                number: item.track_number,
                title: item.name,
                artists: item.artists,
                album: item.album,
                duration_ms: item.duration_ms.totalMilliseconds || item.duration_ms,
                genres: ['rock', 'pop'], // To-Do: pobierz z Discogs (?)
                dateAdded: item.added_at,
                explicit: item.explicit,
                playable: item.is_playable,
                local: item.is_local
            })),
            releaseDate: data.release_date
        }
        fetchedAlbum.detailsToDisplay = [{
            name: 'Name',
            content: fetchedAlbum.name || '',
            showSeparately: true
        }, {
            name: 'Track count',
            content: fetchedAlbum.tracks ? fetchedAlbum.tracks.length || 'N/A' : 'N/A',
            showSeparately: false
        }, {
            name: 'Total Duration',
            content: fetchedAlbum.totalDuration_ms ? millisecondsToFormattedTime(fetchedAlbum.totalDuration_ms) : 'N/A',
            showSeparately: false
        }, {
            name: 'Artist(s)',
            content: fetchedAlbum.artists ? fetchedAlbum.artists.map((artist, index) => {
                return(
                    <Fragment key = {index}>
                        <Link to = {'/artist/' + artist.id}>{artist.name}</Link>
                        {index === fetchedAlbum.artists.length - 1 ? '' : ', '}
                    </Fragment>
                )
            }) : 'N/A',
            showSeparately: false
        }, {
            name: 'Released',
            content: fetchedAlbum.releaseDate ? new Date(fetchedAlbum.releaseDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'}) : 'N/A',
            showSeparately: false
        }, {
            name: 'Description',
            content: '',
            showSeparately: true
        }];
        requestGetAlbumDetails(fetchedAlbum.name, (data) => {
            if(data) {
                fetchedAlbum.extraDetails = data;
            }
            setAlbum(fetchedAlbum);
        });
    }
    // #endregion

    // #region Funkcje pomocnicze
    const getAlbum = (fromAPI = false) => {
        const loggedIn = !!Cookies.get('userID');
        if(!loggedIn) {
            setAlbum(placeholderAlbum);
            return;
        }
        setAlbumLoading(true);
        requestGetAlbum(albumID, handleGetAlbumApiResponse, () => setAlbumLoading(false), fromAPI);
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        getAlbum();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // #endregion

    // #region Struktura komponentu (JSX)
    return (
        <div id = 'page'>
            <NavBar
                defaultFormAction = {defaultFormAction}
                defaultSearchQuery = {defaultSearchQuery}
                onLogin = {handleLogin}
                onLogout = {handleLogout}
                onTogglePlaylistPlaybackVoiceCommand = {props.onRequestDefaultPlaylistPlaybackState}
                onToggleTrackPlaybackVoiceCommand = {(targetState, trackIdentifier) => props.onRequestDefaultTrackPlaybackState(album, targetState, trackIdentifier)}
                onShowItemDetailsVoiceCommand = {(itemType) => itemType === 'album' ? props.onRequestShowItemDetails() : null}
                onShowLyricsVoiceCommand = {props.onRequestShowLyrics}
                onSearch = {() => props.onRequestDefaultSearchQuery(null)}
                onSearchVoiceCommand = {(query) => props.onRequestDefaultSearchQuery(query)}
                onFormActionVoiceCommand = {props.onRequestDefaultFormAction}
            />
            <CatalogBrowser className = 'playlistBrowser hasOverviewPanel'>
                <TrackList
                    key = {'trackList' + album.id}
                    tracks = {album.tracks}
                    defaultPlayingTrack = {defaultPlayingTrack}
                    playingTrack = {playingTrack}
                    for = 'album'
                    playlist = {album}
                    playlistLoading = {albumLoading}
                    onPlaybackToggle = {props.onPlaybackToggle}
                />
                <OverviewPanel
                    key = {album.id}
                    data = {album}
                    for = 'album'
                    playingTrack = {playingTrack}
                    defaultPlaybackState = {defaultPlaybackState}
                    defaultFormAction = {defaultFormAction}
                    defaultItemDetailsDisplay = {defaultArtistDetailsDisplay}
                    onPlaybackToggle = {props.onPlaylistPlaybackToggle}
                    onItemDetailsModalClose = {props.onRequestHideItemDetails}
                />
            </CatalogBrowser>
        </div>
    );
    // #endregion
}

export default Album;