import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

import Styles from 'pages/Home.module.scss';

const Home = () => {
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

    const [playlists, setPlaylists] = useState([playlistGenerator, playlistBuilder]);
    const [playlistGeneratorModalOpen, setPlaylistGeneratorModalOpen] = useState(false);
    const btnSync = useRef(null);
    const navigate = useNavigate();

    // #region Obsługa zdarzeń (Event Handlers)
    const handleLogin = () => {
        getPlaylists();
    }
    const handleLogout = () => {
        setPlaylists([playlistGenerator, playlistBuilder]);
    }
    const handleSyncWithSpotify = () => {
        getPlaylists();
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
    const handleOpenPlaylistGenerator = () => {
        setPlaylistGeneratorModalOpen(true);
    }
    const handleGeneratePlaylist = async (tracks) => {
        const newPlaylistID = await createPlaylist();
        requestGeneratePlaylist(tracks, newPlaylistID, (data) => {
            console.info(data.message);
            navigate(`/playlist/${newPlaylistID}`);
        });
    }
    const handleModalClose_playlistGenerator = () => {
        setPlaylistGeneratorModalOpen(false);
    }
    // #endregion
    
    const getPlaylists = () => {
        const userID = Cookies.get('userID');
        if(!userID) {
            return;
        }
        btnSync.current.classList.add(Styles.spinning);
        requestGetPlaylists((data) => {
            setPlaylists([playlistGenerator, playlistBuilder, savedTracks, ...data]);
            btnSync.current.classList.remove(Styles.spinning);
        });
    }
    const createPlaylist = async () => {
        const userID = Cookies.get('userID');
        if(!userID) {
            return;
        }
        return requestCreatePlaylist(userID, (data) => {
            return data.playlistID;
        });
    }
    
    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        getPlaylists();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return (
        <div id = 'page'>
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
                                    <PlaylistKebabMenu playlistID = {playlist.id} context = 'catalogItem' styles = {Styles} onDeletePlaylist = {handleSyncWithSpotify} />
                            }
                            let playlistGeneratorModal = null;
                            if(playlistGeneratorModalOpen && playlist.type === 'generator') {
                                playlistGeneratorModal =
                                    <PlaylistGeneratorModal onSubmit = {(tracks) => handleGeneratePlaylist(tracks)} onCancel = {handleModalClose_playlistGenerator} />
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

export default Home;