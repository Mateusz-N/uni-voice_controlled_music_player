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
import CatalogBrowser from 'components/CatalogBrowser';
import PlaylistKebabMenu from 'components/generic/instances/PlaylistKebabMenu';
import PlaylistGeneratorModal from 'components/PlaylistGenerator/PlaylistGeneratorModal';
import Toast from 'components/generic/Toast';

import Styles from 'pages/Home.module.scss';

const Home = (props) => {
    // #region Zmienne globalne
    const defaultFormAction = props.defaultFormAction;
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
    const [playlists, setPlaylists] = useState([]);
    const [playlistGeneratorModalOpen, setPlaylistGeneratorModalOpen] = useState(false);
    const [idOfPlaylistToDelete, setIdOfPlaylistToDelete] = useState(null);
    const [playlistGenerator_addSeed, setPlaylistGenerator_addSeed] = useState(false);
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
        setPlaylists([]);
    }
    const handleSyncWithSpotify = () => {
        const loggedIn = !!Cookies.get('userID');
        if(!loggedIn) {
            setNotification({message: 'You must log in to perform this operation!', type: 'error'});
            return;
        }
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
        setIdOfPlaylistToDelete(null);
        props.onRequestDefaultFormAction(null);
    }
    const handleOpenPlaylistGenerator = () => {
        setPlaylistGeneratorModalOpen(true);
    }
    const handleGeneratePlaylist = async (tracks) => {
        const newPlaylistID = await createPlaylist();
        requestGeneratePlaylist(newPlaylistID, tracks, (data) => {
            const notificationMessage = data.message.type === 'success' ? 'Playlist generated successfully!' : data.message.type;
            props.onRequestDefaultFormAction(null);
            navigate(`/playlist/${newPlaylistID}`, {state: {notificationMessage: notificationMessage, notificationType: data.message.type}});
        });
    }
    const handleModalClose_playlistGenerator = () => {
        setPlaylistGeneratorModalOpen(false);
        props.onRequestDefaultFormAction(null);
    }
    const handleShowPlaylistByName = (playlistName) => {
        const matchedPlaylist = findPlaylistByName(playlistName);
        if(!matchedPlaylist) {
            return;
        }
        navigate(`/playlist/${matchedPlaylist.id}`);
    }
    const handleCreatePlaylist = async () => {
        const newPlaylistID = await createPlaylist();
        navigate(`/playlist/${newPlaylistID}`);
    }
    const handleDeletePlaylistByName = (playlistName) => {
        const matchedPlaylist = findPlaylistByName(playlistName);
        if(!matchedPlaylist) {
            return;
        }
        setIdOfPlaylistToDelete(matchedPlaylist.id);
    }
    const handleCancelDeletePlaylist = () => {
        setIdOfPlaylistToDelete(null);
        props.onRequestDefaultFormAction(null);
    }
    const handleSubmitAllForms = () => {
        props.onRequestDefaultFormAction('submit');
    }
    const handleCancelAllForms = () => {
        props.onRequestDefaultFormAction('cancel');
    }
    const handleRequestAddPlaylistGeneratorSeed = () => {
        setPlaylistGenerator_addSeed(true);
    }
    const handleAddPlaylistGeneratorSeed = () => {
        setPlaylistGenerator_addSeed(false);
        props.onRequestDefaultFormAction(null);
    }
    // #endregion
    
    // #region Funkcje pomocnicze
    const getPlaylists = (fromAPI = false) => {
        const loggedIn = !!Cookies.get('userID');
        if(!loggedIn) {
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
    const findPlaylistByName = (playlistName) => {
        return playlists.find(playlist => playlist.name.toLowerCase().replace(/\W/g, '') === playlistName.toLowerCase().replace(/\W/g, ''));
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
            <NavBar
                onLogin = {handleLogin}
                onLogout = {handleLogout}
                onSyncWithSpotifyVoiceCommand = {handleSyncWithSpotify}
                onShowPlaylistVoiceCommand = {handleShowPlaylistByName}
                onCreatePlaylistVoiceCommand = {handleCreatePlaylist}
                onGeneratePlaylistVoiceCommand = {handleOpenPlaylistGenerator}
                onDeletePlaylistVoiceCommand = {handleDeletePlaylistByName}
                onSubmitFormVoiceCommand = {handleSubmitAllForms}
                onCancelFormVoiceCommand = {handleCancelAllForms}
                onAddPlaylistGeneratorSeedVoiceCommand = {handleRequestAddPlaylistGeneratorSeed}
            />
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
                                    <PlaylistKebabMenu
                                        playlist = {playlist}
                                        requestDelete = {idOfPlaylistToDelete === playlist.id}
                                        defaultFormAction = {defaultFormAction}
                                        context = 'catalogItem'
                                        styles = {Styles}
                                        onDeletePlaylist = {handleDeletePlaylist}
                                        onCancelDeletePlaylist = {handleCancelDeletePlaylist}
                                    />
                            }
                            let playlistGeneratorModal = null;
                            if(playlistGeneratorModalOpen && playlist.type === 'generator') {
                                playlistGeneratorModal =
                                    createPortal(<PlaylistGeneratorModal
                                        defaultFormAction = {defaultFormAction}
                                        addSeed = {playlistGenerator_addSeed}
                                        onAddSeed = {handleAddPlaylistGeneratorSeed}
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
        </div>
    );
    // #endregion
}

export default Home;