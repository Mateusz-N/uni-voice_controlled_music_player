import Styles from './CatalogBrowser.module.scss';

import btn_sync from '../resources/btn_sync.svg';
import btn_generate from '../resources/btn_generate.svg';
import albumCover_placeholder from '../resources/albumCover_placeholder.png';

const CatalogBrowser = () => {
    const playlists = [{thumbnailSrc: btn_generate, name: 'Generate new...'},
    {thumbnailSrc: albumCover_placeholder, name: 'playlist2'}, {thumbnailSrc: albumCover_placeholder, name: 'playlist3'},
    {thumbnailSrc: albumCover_placeholder, name: 'playlist4'}, {thumbnailSrc: albumCover_placeholder, name: 'playlist5'},
    {thumbnailSrc: albumCover_placeholder, name: 'playlist6'}, {thumbnailSrc: albumCover_placeholder, name: 'playlist7'},
    {thumbnailSrc: albumCover_placeholder, name: 'playlist8'}, {thumbnailSrc: albumCover_placeholder, name: 'playlist9'},
    {thumbnailSrc: albumCover_placeholder, name: 'playlist10'}, {thumbnailSrc: albumCover_placeholder, name: 'playlist11'},
    {thumbnailSrc: albumCover_placeholder, name: 'playlist12'}, {thumbnailSrc: albumCover_placeholder, name: 'playlist13'},
    {thumbnailSrc: albumCover_placeholder, name: 'playlist14'}, {thumbnailSrc: albumCover_placeholder, name: 'playlist15'},
    {thumbnailSrc: albumCover_placeholder, name: 'playlist16'}, {thumbnailSrc: albumCover_placeholder, name: 'playlist17'},
    {thumbnailSrc: albumCover_placeholder, name: 'playlist18'}, {thumbnailSrc: albumCover_placeholder, name: 'playlist19'}];
    const handleSyncWithSpotify = () => {
        // to-do
    }

    return(
        <div id = {Styles.catalogBrowser}>
            <h1 id = {Styles.yourCatalog}>
                Your catalog&nbsp;
                <img src = {btn_sync} alt = 'Sync with Spotify' id = {Styles.btnSync} onClick = {handleSyncWithSpotify} />
            </h1>
            <main id = {Styles.mainSection}>
                {
                    playlists.map((playlist, index) => {
                        return(
                            <article key = {index} className = {Styles.catalogItem}>
                                <a href = {`./${playlist.name}`}><img src = {playlist.thumbnailSrc} alt = {playlist.name} className = {Styles.catalogItem_thumbnail} /></a>
                                <a href = {`./${playlist.name}`}><h4 className = {Styles.catalogItem_name}>{playlist.name}</h4></a>
                            </article>
                        );
                    })
                }
            </main>
        </div>
    );
}

export default CatalogBrowser;