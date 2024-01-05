import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar/NavBar';
import PlaybackPanel from 'components/PlaybackPanel';
import CatalogBrowser from 'components/CatalogBrowser';

const Settings = () => {
    return (
        <div id = 'page'>
            <NavBar />
            <CatalogBrowser>

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

export default Settings;