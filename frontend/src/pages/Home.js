import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';

import { romanToDecimal, toVoiceCommand } from 'common/auxiliaryFunctions';
import { requestGetPlaylists, requestCreatePlaylist, requestGeneratePlaylist } from 'common/serverRequests';

import btn_sync from 'resources/btn_sync.svg';
import btn_generate from 'resources/btn_generate.svg';
import btn_build from 'resources/btn_build.svg';
import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';
import savedTracksAlbumCoverSrc from 'resources/albumCover_savedTracks.png';

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
        thumbnailSrc: savedTracksAlbumCoverSrc
    }
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [playlists, setPlaylists] = useState([]);
    const [playlistGeneratorModalOpen, setPlaylistGeneratorModalOpen] = useState(false);
    const [defaultSearchQuery, setDefaultSearchQuery] = useState(props.defaultSearchQuery);
    const [idOfPlaylistToDelete, setIdOfPlaylistToDelete] = useState(null);
    const [playlistGeneratorParameter, setPlaylistGeneratorParameter] = useState(null);
    const [playlistGenerator_addSeed, setPlaylistGenerator_addSeed] = useState(false);
    const [identifierOfSeedToRemove, setIdentifierOfSeedToRemove] = useState(null);
    const [identifierOfSeedType, setIdentifierOfSeedType] = useState(null);
    const [identifierOfSeedToSelect, setIdentifierOfSeedToSelect] = useState(null);
    const [notification, setNotification] = useState({});
    // #endregion

    // #region Zmienne lokalizacji (useLocation Hooks)
    const location = useLocation();
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
            const notificationMessage = data.message.type === 'success' ? 'Playlist generated successfully!' : data.message.message;
            props.onRequestDefaultFormAction(null);
            setIdentifierOfSeedToSelect(null);
            navigate(`/playlist/${newPlaylistID}`, {state: {notificationMessage: notificationMessage, notificationType: data.message.type}});
        });
    }
    const handleModalClose_playlistGenerator = () => {
        setPlaylistGeneratorModalOpen(false);
        props.onRequestDefaultFormAction(null);
        setIdentifierOfSeedToSelect(null);
    }
    const handleCreatePlaylist = async () => {
        const newPlaylistID = await createPlaylist();
        navigate(`/playlist/${newPlaylistID}`);
    }
    const handleDeletePlaylistByName = (playlistName) => {
        const matchedPlaylist = props.onRequestFindItemByName(playlists, playlistName);
        if(!matchedPlaylist) {
            return;
        }
        setIdOfPlaylistToDelete(matchedPlaylist.id);
    }
    const handleCancelDeletePlaylist = () => {
        setIdOfPlaylistToDelete(null);
        props.onRequestDefaultFormAction(null);
    }
    const handleRequestAddPlaylistGeneratorSeed = () => {
        setPlaylistGenerator_addSeed(true);
    }
    const handleAddPlaylistGeneratorSeed = () => {
        setPlaylistGenerator_addSeed(false);
        props.onRequestDefaultFormAction(null);
        props.onRequestDefaultSearchQuery(null);
    }
    const handleRequestRemovePlaylistGeneratorSeed = (seedIdentifier) => {
        setIdentifierOfSeedToRemove(toVoiceCommand(romanToDecimal(seedIdentifier))); // seedIdentifier - liczba porządkowa lub nazwa
    }
    const handleRemovePlaylistGeneratorSeed = () => {
        setIdentifierOfSeedToRemove(null);
    }
    const handleModalCloseFail_playlistGenerator = () => {
        props.onRequestDefaultFormAction(null);
        props.onRequestDefaultSearchQuery(null);
        setIdentifierOfSeedToSelect(null);
    }
    const handleRequestChangePlaylistGeneratorSeedType = (seedTypeIdentifier) => {
        setIdentifierOfSeedType(toVoiceCommand(romanToDecimal(seedTypeIdentifier)));
    }
    const handleRequestSelectPlaylistGeneratorSeed = (seedIdentifier) => {
        setIdentifierOfSeedToSelect(toVoiceCommand(romanToDecimal(seedIdentifier)));
    }
    const handleRequestSetPlaylistGeneratorParameter = (parameterName, value) => {
        setPlaylistGeneratorParameter({name: parameterName, value: value.replace(',', '.')}); // 0,5 => 0.5 etc.
    }
    // #endregion
    
    // #region Funkcje pomocnicze
    const getPlaylists = (fromAPI = Cookies.get('preferences') ? JSON.parse(Cookies.get('preferences')).auto_spotify_sync : false) => {
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
    // #endregion
    
    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        getPlaylists();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    useEffect(() => {
        setDefaultSearchQuery(props.defaultSearchQuery);
    },[props.defaultSearchQuery]);

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
                defaultFormAction = {defaultFormAction}
                defaultSearchQuery = {playlistGeneratorModalOpen ? null : defaultSearchQuery}
                onLogin = {handleLogin}
                onLogout = {handleLogout}
                onSearch = {() => props.onRequestDefaultSearchQuery(null)}
                onSyncWithSpotifyVoiceCommand = {handleSyncWithSpotify}
                onShowLyricsVoiceCommand = {props.onRequestShowLyrics}
                onSearchVoiceCommand = {(query) => props.onRequestDefaultSearchQuery(query)}
                onShowItemVoiceCommand = {(itemType, itemName) => props.onRequestShowItemByName(itemType, playlists, itemName)}
                onCreatePlaylistVoiceCommand = {handleCreatePlaylist}
                onGeneratePlaylistVoiceCommand = {handleOpenPlaylistGenerator}
                onDeletePlaylistVoiceCommand = {handleDeletePlaylistByName}
                onFormActionVoiceCommand = {props.onRequestDefaultFormAction}
                onAddPlaylistGeneratorSeedVoiceCommand = {handleRequestAddPlaylistGeneratorSeed}
                onRemovePlaylistGeneratorSeedVoiceCommand = {handleRequestRemovePlaylistGeneratorSeed}
                onChangePlaylistGeneratorSeedTypeVoiceCommand = {handleRequestChangePlaylistGeneratorSeedType}
                onSelectPlaylistGeneratorSeedVoiceCommand = {handleRequestSelectPlaylistGeneratorSeed}
                onSetPlaylistGeneratorParameterVoiceCommand = {(parameterName, value) => handleRequestSetPlaylistGeneratorParameter(parameterName, value)}
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
                                        defaultSearchQuery = {defaultSearchQuery}
                                        addSeed = {playlistGenerator_addSeed}
                                        removeSeed = {identifierOfSeedToRemove}
                                        seedType = {identifierOfSeedType}
                                        selectSeed = {identifierOfSeedToSelect}
                                        setParameter = {playlistGeneratorParameter}
                                        onAddSeed = {handleAddPlaylistGeneratorSeed}
                                        onRemoveSeed = {handleRemovePlaylistGeneratorSeed}
                                        onSubmit = {(tracks) => handleGeneratePlaylist(tracks)}
                                        onCancel = {handleModalClose_playlistGenerator}
                                        onCloseModalFail = {handleModalCloseFail_playlistGenerator}
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