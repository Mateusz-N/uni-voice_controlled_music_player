import { Link } from 'react-router-dom';

import btn_sync from 'resources/btn_sync.svg';
import btn_generate from 'resources/btn_generate.svg';
import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';
import placeholderProfilePicSrc from 'resources/profilePic_placeholder.png';

import NavBar from 'components/NavBar';
import PlaybackPanel from 'components/PlaybackPanel';
import CatalogBrowser from 'components/CatalogBrowser';

import Styles from 'pages/Home.module.scss';

const Home = () => {
    const playlists = [{id: 'ABC', thumbnailSrc: btn_generate, name: 'Generate new...'},
    {id: 'ABC123', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist2'}, {id: 'ABC1234', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist3'},
    {id: 'ABC1235', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist4'}, {id: 'ABC1236', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist5'},
    {id: 'ABC1237', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist6'}, {id: 'ABC1238', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist7'},
    {id: 'ABC1239', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist8'}, {id: 'ABC124', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist9'},
    {id: 'ABC125', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist10'}, {id: 'ABC126', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist11'},
    {id: 'ABC127', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist12'}, {id: 'ABC128', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist13'},
    {id: 'ABC129', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist14'}, {id: 'ABC13', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist15'},
    {id: 'ABC14', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist16'}, {id: 'ABC15', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist17'},
    {id: 'ABC16', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist18'}, {id: 'ABC17', thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist19'}];
    const handleSyncWithSpotify = () => {
        // to-do
    }

    return (
        <div id = 'page'>
            <NavBar loggedUser = {{
                name: 'User',
                profilePic: placeholderProfilePicSrc
            }} />
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
                                    <Link to = {playlist.id === 'ABC' ? './generator' : './playlist/' + playlist.id}><img src = {playlist.thumbnailSrc} alt = {playlist.name} className = {Styles.catalogItem_thumbnail} /></Link>
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