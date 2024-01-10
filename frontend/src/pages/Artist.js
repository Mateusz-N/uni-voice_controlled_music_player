import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';

import { requestGetArtist, requestGetArtistAlbums } from 'common/serverRequests';
import { placeholderArtist } from 'common/placeholderObjects';

import btn_sync from 'resources/btn_sync.svg';
import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar/NavBar';
import PlaybackPanel from 'components/PlaybackPanel';
import CatalogBrowser from 'components/CatalogBrowser';
import OverviewPanel from 'components/OverviewPanel/OverviewPanel';

import Styles from 'pages/Home.module.scss';

const Artist = () => {
    // #region Zmienne globalne
    const artistID = window.location.href.split('/').pop();
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [loggedIn, setLoggedIn] = useState(!!Cookies.get('userID'));
    const [artist, setArtist] = useState(placeholderArtist);
    const [albums, setAlbums] = useState([]);
    // #endregion

    const btnSync = useRef(null);

    // #region Obsługa zdarzeń (Event Handlers)
    const handleLogin = () => {
        setLoggedIn(true);
    }
    const handleLogout = () => {
        setLoggedIn(false);
    }
    const getArtist = (fromAPI = false) => {
        if(!loggedIn) {
            setArtist(placeholderArtist);
            setAlbums([]);
            return;
        }
        btnSync.current.classList.add(Styles.spinning);
        requestGetArtist(artistID, (data) => {
            const artist = {
                id: artistID,
                name: data.name,
                thumbnailSrc: (data.images.length > 0 ? data.images[0].url : placeholderAlbumCoverSrc),
                genres: data.genres,
                followers: data.followers.total,
                popularity: data.popularity,
                detailsToDisplay: [{
                    name: 'Name',
                    content: data.name || '',
                    showSeparately: true
                }, {
                    name: 'Genres',
                    content: data.genres ? data.genres.join(', ') : 'N/A',
                    showSeparately: false
                }, {
                    name: 'Followers',
                    content: data.followers.total || 'N/A',
                    showSeparately: false
                }, {
                    name: 'Popularity',
                    content: data.popularity || 'N/A',
                    showSeparately: false
                }, {
                    name: 'Description',
                    content: '',
                    showSeparately: true
                }]
            }
            setArtist(artist);
        }, fromAPI);
        getAlbums(artistID);
    }
    const getAlbums = (artistID) => {
        if(Cookies.get('userID')) {
            requestGetArtistAlbums(artistID, (data) => {
                data.map(album => {
                    if(album.images && album.images.length > 0) {
                        album.thumbnailSrc = album.images[0].url;
                    }
                });
                setAlbums(data);
                btnSync.current.classList.remove(Styles.spinning);
            });
        }
    }
    const handleSyncWithSpotify = () => {
        getArtist(true);
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        getArtist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[loggedIn])
    // #endregion

    // #region Struktura komponentu (JSX)
    return (
        <div id = 'page'>
            <NavBar onLogin = {handleLogin} onLogout = {handleLogout} />
            <CatalogBrowser className = 'collectionBrowser hasOverviewPanel'>
                <h1 id = {Styles.catalogHeader}>
                    {artist.name}&nbsp;
                    <img src = {btn_sync} alt = 'Sync with Spotify' id = {Styles.btnSync} onClick = {handleSyncWithSpotify} ref = {btnSync} />
                </h1>
                <main id = {Styles.mainSection}>
                    {
                        albums.map((album, index) => {
                            return(
                                <article key = {index} className = {Styles.catalogItem}>
                                    <Link to = {'/album/' + album.id}>
                                        <img src = {album.thumbnailSrc || placeholderAlbumCoverSrc} alt = {album.name} className = {Styles.catalogItem_thumbnail} />
                                    </Link>
                                    <Link to = {'/album/' + album.id}><h4 className = {Styles.catalogItem_name}>{album.name}</h4></Link>
                                </article>
                            );
                        })
                    }
                </main>
                <OverviewPanel key = {artist.id} data = {artist} for = 'artist' />
            </CatalogBrowser>
            <PlaybackPanel track = {{
                duration_ms: '15000',
                trackTitle: 'Song',
                artists: ['Artist'],
                albumTitle: 'Artist',
                albumCoverSrc: placeholderAlbumCoverSrc
            }} />
        </div>
    );
    // #endregion
}

export default Artist;