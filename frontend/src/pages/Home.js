import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
        id: 'ABC',
        thumbnailSrc: btn_generate,
        name: 'Generate new...'
    }
    const [playlists, setPlaylists] = useState([playlistGenerator]);

    const onLogout = () => {
        setPlaylists([playlistGenerator]);
    }
    const getPlaylists = () => {
        if(Cookies.get('userID')) {
            fetch('http://localhost:3030/spotify/playlists', {
                method: 'GET',
                credentials: 'include'
            })
                .then((response) => {
                    if(response.ok) {
                        return response.json()
                    }
                })
                .then((data) => {
                    console.log(data)
                    setPlaylists([playlistGenerator, ...data])
                })
                .catch(console.error);
        }
    }
    const handleSyncWithSpotify = () => {
        getPlaylists();
    }
    
    useEffect(() => {
        getPlaylists();
    },[])

    return (
        <div id = 'page'>
            <NavBar handleLogout = {onLogout} />
            <CatalogBrowser className = 'homeBrowser'>
                <h1 id = {Styles.yourCatalog}>
                    Your catalog&nbsp;
                    <img src = {btn_sync} alt = 'Sync with Spotify' id = {Styles.btnSync} onClick = {handleSyncWithSpotify} />
                </h1>
                <main id = {Styles.mainSection}>
                    {
                        playlists.map((playlist, index) => {
                            return(
                                <article key = {index} className = {Styles.catalogItem}>
                                    <Link to = {playlist.id === 'ABC' ? './generator' : './playlist/' + playlist.id}>
                                        <img src = {playlist.thumbnailSrc} alt = {playlist.name} className = {Styles.catalogItem_thumbnail} />
                                    </Link>
                                    <Link to = {'./playlist/' + playlist.id}><h4 className = {Styles.catalogItem_name}>{playlist.name}</h4></Link>
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
}

export default Home;