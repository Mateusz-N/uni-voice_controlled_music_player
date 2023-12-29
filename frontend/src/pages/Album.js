import { Link } from 'react-router-dom';
import { useState, useEffect, Fragment } from 'react';
import Cookies from 'js-cookie';

import { millisecondsToFormattedTime } from 'common/auxiliaryFunctions';

import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar';
import PlaybackPanel from 'components/PlaybackPanel';
import CatalogBrowser from 'components/CatalogBrowser';
import TrackList from 'components/TrackList';
import OverviewPanel from 'components/OverviewPanel/OverviewPanel';

const Album = () => {
    // #region Zmienne globalne
    const albumID = window.location.href.split('/').pop();
    const placeholderAlbum = {
        id: albumID,
        name: 'Unknown album',
        thumbnailSrc: placeholderAlbumCoverSrc,
        totalDuration_ms: 0,
        artists: [],
        tracks: [],
        releaseDate: 'N/A',
        detailsToDisplay: []
    };
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [loggedIn, setLoggedIn] = useState(!!Cookies.get('userID'));
    const [album, setAlbum] = useState(placeholderAlbum);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const onLogin = () => {
        setLoggedIn(true);
    }
    const onLogout = () => {
        setLoggedIn(false);
    }
    const getAlbum = () => {
        if(!loggedIn) {
            setAlbum(placeholderAlbum);
            return;
        }
        fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/album/${albumID}`, {
            method: 'GET',
            credentials: 'include'
        })
            .then((response) => {
                if(response.ok) {
                    return response.json()
                }
            })
            .then((data) => {
                const album = {
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
                album.detailsToDisplay = [{
                    name: 'Track count',
                    content: album.tracks ? album.tracks.length || 'N/A' : 'N/A'
                }, {
                    name: 'Total Duration',
                    content: album.totalDuration_ms ? millisecondsToFormattedTime(album.totalDuration_ms) : 'N/A'
                }, {
                    name: 'Artist(s)',
                    content: album.artists ? album.artists.map((artist, index) => {
                        return(
                            <Fragment key = {index}>
                                <Link to = {'/artist/' + artist.id}>{artist.name}</Link>
                                {index === album.artists.length - 1 ? '' : ', '}
                            </Fragment>
                        )
                    }) : '?'
                }, {
                    name: 'Released',
                    content: album.releaseDate ? new Date(album.releaseDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'}) : '?'
                }];
                setAlbum(album);
            })
            .catch(console.error);
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        getAlbum();
    }, [loggedIn]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return (
        <div id = 'page'>
            <NavBar handleLogin = {onLogin} handleLogout = {onLogout} />
            <CatalogBrowser className = 'playlistBrowser hasOverviewPanel'>
                <TrackList tracks = {album.tracks} for = 'album' />
                <OverviewPanel data = {album} for = 'album' />
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

export default Album;