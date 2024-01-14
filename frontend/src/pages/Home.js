import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';

import { requestGetPlaylists, requestCreatePlaylist, requestGeneratePlaylist } from 'common/serverRequests';

import btn_sync from 'resources/btn_sync.svg';
import btn_generate from 'resources/btn_generate.svg';
import btn_build from 'resources/btn_build.svg';
import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar/NavBar';
import PlaybackPanel from 'components/PlaybackPanel';
import CatalogBrowser from 'components/CatalogBrowser';
import PlaylistKebabMenu from 'components/generic/instances/PlaylistKebabMenu';
import PlaylistGeneratorModal from 'components/PlaylistGenerator/PlaylistGeneratorModal';
import Toast from 'components/generic/Toast';

import Styles from 'pages/Home.module.scss';
import EmbeddedPlayer from 'components/EmbeddedPlayer';

const Home = () => {
    // #region Zmienne globalne
    const playlistGenerator = {
        id: '0',
        type: 'generator',
        name: 'Generate new...',
        thumbnailSrc: btn_generate
    }
    const playlistBuilder = {
        id: '1',
        type: 'builder',
        name: 'Create new manually...',
        thumbnailSrc: btn_build
    }
    const savedTracks =  {
        id: '2',
        type: 'playlist',
        name: 'Saved tracks',
        thumbnailSrc: placeholderAlbumCoverSrc
    }
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [playlists, setPlaylists] = useState([playlistGenerator, playlistBuilder]);
    const [playlistGeneratorModalOpen, setPlaylistGeneratorModalOpen] = useState(false);
    const [notification, setNotification] = useState({});
    // #endregion

    // #region Zmienne referencji (useRef Hooks)
    const btnSync = useRef(null);
    // #endregion

    // #region Zmienne nawigacji (useNavigate Hooks)
    const navigate = useNavigate();
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleLogin = () => {
        getPlaylists();
    }
    const handleLogout = () => {
        setPlaylists([playlistGenerator, playlistBuilder]);
    }
    const handleSyncWithSpotify = () => {
        getPlaylists(true);
    }
    const handlePlaylistLinkClick = async (event, playlistType) => {
        if(playlistType === 'builder') {
            event.preventDefault();
            const newPlaylistID = await createPlaylist();
            navigate(`/playlist/${newPlaylistID}`);
        }
        else if(playlistType === 'generator') {
            event.preventDefault();
            handleOpenPlaylistGenerator();
        }
    }
    const handleDeletePlaylist = () => {
        setNotification({message: 'Playlist deleted successfully!', type: 'success'});
        handleSyncWithSpotify();
    }
    const handleOpenPlaylistGenerator = () => {
        setPlaylistGeneratorModalOpen(true);
    }
    const handleGeneratePlaylist = async (tracks) => {
        const newPlaylistID = await createPlaylist();
        requestGeneratePlaylist(newPlaylistID, tracks, (data) => {
            const notificationMessage = data.message.type === 'success' ? 'Playlist generated successfully!' : data.message.type;
            navigate(`/playlist/${newPlaylistID}`, {state: {notificationMessage: notificationMessage, notificationType: data.message.type}});
        });
    }
    const handleModalClose_playlistGenerator = () => {
        setPlaylistGeneratorModalOpen(false);
    }
    // #endregion
    
    // #region Funkcje pomocnicze
    const getPlaylists = (fromAPI = false) => {
        const userID = Cookies.get('userID');
        if(!userID) {
            return;
        }
        btnSync.current.classList.add(Styles.spinning);
        requestGetPlaylists((data) => {
            setPlaylists([playlistGenerator, playlistBuilder, savedTracks, ...data]);
            btnSync.current.classList.remove(Styles.spinning);
        }, fromAPI);
    }
    const createPlaylist = async () => {
        const userID = Cookies.get('userID');
        if(!userID) {
            return;
        }
        return await requestCreatePlaylist(userID, (data) => {
            return data.playlistID;
        });
    }
    // #endregion
    
    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        getPlaylists();
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
            <NavBar onLogin = {handleLogin} onLogout = {handleLogout} />
            <CatalogBrowser className = 'collectionBrowser'>
                <h1 id = {Styles.catalogHeader}>
                    Your catalog&nbsp;
                    <img src = {btn_sync} alt = 'Sync with Spotify' id = {Styles.btnSync} onClick = {handleSyncWithSpotify} ref = {btnSync} />
                </h1>
                <main id = {Styles.mainSection}>
                    {
                        playlists.map((playlist, index) => {
                            const playlistLink = playlist.type === 'playlist' ? '/playlist/' + playlist.id : '/' + playlist.type;
                            let kebabMenu = null;
                            if(!['generator', 'builder'].includes(playlist.type)) {
                                kebabMenu =
                                    <PlaylistKebabMenu playlistID = {playlist.id} context = 'catalogItem' styles = {Styles} onDeletePlaylist = {handleDeletePlaylist} />
                            }
                            let playlistGeneratorModal = null;
                            if(playlistGeneratorModalOpen && playlist.type === 'generator') {
                                playlistGeneratorModal =
                                    createPortal(<PlaylistGeneratorModal
                                        onSubmit = {(tracks) => handleGeneratePlaylist(tracks)}
                                        onCancel = {handleModalClose_playlistGenerator}
                                    />, document.body);
                            }
                            return(
                                <figure key = {index} className = {Styles.catalogItem}>
                                    <main className = {Styles.catalogItem_thumbnail}>
                                        <Link to = {playlistLink} onClick = {(event) => handlePlaylistLinkClick(event, playlist.type)}>
                                            <img
                                                src = {playlist.thumbnailSrc || (playlist.images && playlist.images[0] ? playlist.images[0].url : placeholderAlbumCoverSrc)}
                                                alt = {playlist.name} className = {Styles.catalogItem_thumbnailImage}
                                            />
                                        </Link>
                                        {kebabMenu}
                                        {playlistGeneratorModal}
                                    </main>
                                    <Link to = {playlistLink} onClick = {(event) => handlePlaylistLinkClick(event, playlist.type)} title = {playlist.name}>
                                        <h4 className = {Styles.catalogItem_name}>{playlist.name}</h4>
                                    </Link>
                                </figure>
                            );
                        })
                    }
                </main>
            </CatalogBrowser>
            {/* <PlaybackPanel track = {{
                duration_ms: '15000',
                trackTitle: 'Song',
                artists: ['Artist'],
                albumTitle: 'Album',
                albumCoverSrc: placeholderAlbumCoverSrc
            }} /> */}
            <EmbeddedPlayer track />
        </div>
    );
    // #endregion
}

export default Home;