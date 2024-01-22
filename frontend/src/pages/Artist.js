import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';

import { toVoiceCommand } from 'common/auxiliaryFunctions';
import { requestGetArtist, requestGetArtistAlbums, requestGetArtistDetails } from 'common/serverRequests';
import { placeholderArtist } from 'common/placeholderObjects';

import btn_sync from 'resources/btn_sync.svg';
import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar/NavBar';
import CatalogBrowser from 'components/CatalogBrowser';
import OverviewPanel from 'components/OverviewPanel/OverviewPanel';

import Styles from 'pages/Home.module.scss';

const Artist = (props) => {
    // #region Zmienne globalne
    const defaultFormAction = props.defaultFormAction;
    const defaultSearchQuery = props.defaultSearchQuery;
    const artistID = window.location.href.split('/').pop();
    const playingTrack = props.playingTrack;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [artist, setArtist] = useState(placeholderArtist);
    const [albums, setAlbums] = useState([]);
    // #endregion

    // #region Zmienne referencji (useRef Hooks)
    const btnSync = useRef(null);
    // #endregion

    // #region Zmienne nawigacji (useNavigate Hooks)
    const navigate = useNavigate();
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleLogin = () => {
        getArtist();
    }
    const handleLogout = () => {
        getArtist();
    }
    const handleSyncWithSpotify = () => {
        getArtist(true);
    }
    const handleShowAlbumByName = (albumName) => {
        const matchedAlbum = albums.find(album => toVoiceCommand(album.name) === toVoiceCommand(albumName));
        navigate(`/album/${matchedAlbum.id}`);
    }
    // #endregion

    // #region Funkcje pomocnicze
    const getArtist = (fromAPI = false) => {
        const loggedIn = !!Cookies.get('userID');
        if(!loggedIn) {
            setArtist(placeholderArtist);
            setAlbums([]);
            return;
        }
        btnSync.current.classList.add(Styles.spinning);
        requestGetArtist(artistID, (data) => {
            const fetchedArtist = {
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
                    content: data.genres && data.genres.length > 0 ? data.genres.join(', ') : 'N/A',
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
            requestGetArtistDetails(fetchedArtist.name, (data) => {
                if(data) {
                    fetchedArtist.extraDetails = data;
                    fetchedArtist.detailsToDisplay.find(detail => detail.name === 'Description').content = data.profile;
                }
                setArtist(fetchedArtist);
            });
        }, fromAPI);
        getAlbums(artistID);
    }
    const getAlbums = (artistID) => {
        const loggedIn = !!Cookies.get('userID');
        if(!loggedIn) {
            return;
        }
        requestGetArtistAlbums(artistID, (data) => {
            data.forEach(album => {
                if(album.images && album.images.length > 0) {
                    album.thumbnailSrc = album.images[0].url;
                }
            });
            setAlbums(data);
            btnSync.current.classList.remove(Styles.spinning);
        });
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        getArtist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return (
        <div id = 'page'>
            <NavBar
                defaultFormAction = {defaultFormAction}
                defaultSearchQuery = {defaultSearchQuery}
                onLogin = {handleLogin}
                onLogout = {handleLogout}
                onSearch = {() => props.onRequestDefaultSearchQuery(null)}
                onSyncWithSpotifyVoiceCommand = {handleSyncWithSpotify}
                onShowLyricsVoiceCommand = {props.onRequestShowLyrics}
                onSearchVoiceCommand = {(query) => props.onRequestDefaultSearchQuery(query)}
                onShowItemVoiceCommand = {(itemType, itemName) => props.onRequestShowItemByName(itemType, albums, itemName)}
                onShowAlbumVoiceCommand = {handleShowAlbumByName}
                onFormActionVoiceCommand = {props.onRequestDefaultFormAction}
            />
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
                                    <main className = {Styles.catalogItem_thumbnail}>
                                        <Link to = {'/album/' + album.id}>
                                            <img src = {album.thumbnailSrc || placeholderAlbumCoverSrc} alt = {album.name} className = {Styles.catalogItem_thumbnailImage} />
                                        </Link>
                                    </main>
                                    <Link to = {'/album/' + album.id}>
                                        <h4 className = {Styles.catalogItem_name} title = {album.name}>{album.name}</h4>
                                    </Link>
                                </article>
                            );
                        })
                    }
                </main>
                <OverviewPanel key = {artist.id} data = {artist} for = 'artist' playingTrack = {playingTrack} />
            </CatalogBrowser>
        </div>
    );
    // #endregion
}

export default Artist;