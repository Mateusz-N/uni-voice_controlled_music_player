import NavBar from '../components/NavBar';
import PlaybackPanel from '../components/PlaybackPanel';
import CatalogBrowser from '../components/CatalogBrowser';

import placeholderAlbumCoverSrc from '../resources/albumCover_placeholder.png';
import placeholderProfilePicSrc from '../resources/profilePic_placeholder.png';

const Settings = () => {
    return (
        <div id = 'page'>
            <NavBar loggedUser = {{
                name: 'User',
                profilePic: placeholderProfilePicSrc
            }}
            ></NavBar>
            <CatalogBrowser>

            </CatalogBrowser>
            <PlaybackPanel track =
                {{
                duration_ms: '15000',
                trackTitle: 'Song',
                artists: ['Artist'],
                albumTitle: 'Album',
                albumCoverSrc: placeholderAlbumCoverSrc
                }}
            ></PlaybackPanel>
        </div>
    );
}

export default Settings;