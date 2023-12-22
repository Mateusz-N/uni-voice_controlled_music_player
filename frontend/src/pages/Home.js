import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';

import btn_sync from 'resources/btn_sync.svg';
import btn_generate from 'resources/btn_generate.svg';
import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar';
import PlaybackPanel from 'components/PlaybackPanel';
import CatalogBrowser from 'components/CatalogBrowser';

import Styles from 'pages/Home.module.scss';

const Home = () => {
    const playlistGenerator = {
        id: '0',
        type: 'generator',
        name: 'Generate new...',
        thumbnailSrc: btn_generate
    }
    const savedTracks =  {
        id: '1',
        type: 'playlist',
        name: 'Saved tracks',
        thumbnailSrc: placeholderAlbumCoverSrc
    }

    const [playlists, setPlaylists] = useState([playlistGenerator]);
    const btnSync = useRef(null);

    // #region Obsługa zdarzeń (Event Handlers)
    const onLogin = () => {
        getPlaylists();
    }
    const onLogout = () => {
        setPlaylists([playlistGenerator]);
    }
    const getPlaylists = () => {
        if(Cookies.get('userID')) {
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
                    setPlaylists([playlistGenerator, savedTracks, ...data]);
                    btnSync.current.classList.remove(Styles.spinning);
                })
                .catch(console.error);
        }
    }
    const handleSyncWithSpotify = () => {
        getPlaylists();
    }
    // #endregion
    
    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        getPlaylists();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    // #endregion

    // #region Struktura komponentu (JSX)
    return (
        <div id = 'page'>
            <NavBar handleLogin = {onLogin} handleLogout = {onLogout} />
            <CatalogBrowser className = 'collectionBrowser'>
                <h1 id = {Styles.catalogHeader}>
                    Your catalog&nbsp;
                    <img src = {btn_sync} alt = 'Sync with Spotify' id = {Styles.btnSync} onClick = {handleSyncWithSpotify} ref = {btnSync} />
                </h1>
                <main id = {Styles.mainSection}>
                    {
                        playlists.map((playlist, index) => {
                            return(
                                <article key = {index} className = {Styles.catalogItem}>
                                    <Link to = {playlist.type === 'generator' ? '/generator' : '/playlist/' + playlist.id}>
                                        <img src = {playlist.thumbnailSrc || placeholderAlbumCoverSrc} alt = {playlist.name} className = {Styles.catalogItem_thumbnail} />
                                    </Link>
                                    <Link to = {'/playlist/' + playlist.id}><h4 className = {Styles.catalogItem_name}>{playlist.name}</h4></Link>
                                </article>
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