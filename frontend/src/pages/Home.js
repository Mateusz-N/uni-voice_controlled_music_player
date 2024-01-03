import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import btn_sync from 'resources/btn_sync.svg';
import btn_generate from 'resources/btn_generate.svg';
import btn_build from 'resources/btn_build.svg';
import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar';
import PlaybackPanel from 'components/PlaybackPanel';
import CatalogBrowser from 'components/CatalogBrowser';
import PlaylistKebabMenu from 'components/PlaylistKebabMenu';

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
    const btnSync = useRef(null);
    const navigate = useNavigate();

    // #region Obsługa zdarzeń (Event Handlers)
    const handleLogin = () => {
        getPlaylists();
    }
    const handleLogout = () => {
        setPlaylists([playlistGenerator, playlistBuilder]);
    }
    const getPlaylists = () => {
        const userID = Cookies.get('userID');
        if(!userID) {
            return;
        }
        btnSync.current.classList.add(Styles.spinning);
        fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/playlists`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then((response) => {
                if(response.ok) {
                    return response.json();
                }
            })
            .then((data) => {
                setPlaylists([playlistGenerator, playlistBuilder, savedTracks, ...data]);
                btnSync.current.classList.remove(Styles.spinning);
            })
            .catch(console.error);
    }
    const createPlaylist = async () => {
        const userID = Cookies.get('userID');
        if(!userID) {
            return;
        }
        return fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/${userID}/playlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then((response) => {
                if(response.ok) {
                    return response.json();
                }
                if(response.status === 401) {
                    throw new Error('Invalid access token!');
                }
            })
            .then((data) => {
                return data.playlistID;
            })
            .catch(console.error);
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
    }
    // #endregion
    
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
                            if(!['0', '1'].includes(playlist.id)) {
                                kebabMenu =
                                    <PlaylistKebabMenu playlistID = {playlist.id} context = 'catalogItem' styles = {Styles} onDeletePlaylist = {handleSyncWithSpotify} />
                            }
                            return(
                                <figure key = {index} className = {Styles.catalogItem}>
                                    <main className = {Styles.catalogItem_thumbnail}>
                                        <Link to = {playlistLink} onClick = {(event) => handlePlaylistLinkClick(event, playlist.type)}>
                                            <img src = {playlist.thumbnailSrc || placeholderAlbumCoverSrc} alt = {playlist.name} className = {Styles.catalogItem_thumbnailImage} />
                                        </Link>
                                        {kebabMenu}
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