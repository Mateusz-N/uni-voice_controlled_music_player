import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar';
import PlaybackPanel from 'components/PlaybackPanel';
import CatalogBrowser from 'components/CatalogBrowser';
import TrackList from 'components/TrackList';
import PlaylistOverview from 'components/PlaylistOverview';

const Album = () => {
    const [album, setAlbum] = useState({});
    const getAlbum = () => {
        if(Cookies.get('userID')) {
            const albumID = window.location.href.split('/').pop();
            fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/album/${albumID}`, {
                method: 'GET',
                credentials: 'include'
            })
                .then((response) => {
                    if(response.ok) {
                        return response.json()
                    }
                })
                .then((data) => {
                    const album = {
                        id: albumID,
                        name: data.name,
                        thumbnailSrc: (data.images.length > 0 ? data.images[0].url : placeholderAlbumCoverSrc),
                        totalDuration_ms: data.tracks.items.reduce((totalDuration_ms, item) => totalDuration_ms + (item.duration_ms.totalMilliseconds || item.duration_ms), 0),
                        artists: data.artists,
                        tracks: data.tracks.items.map(item => ({
                            id: item.id,
                            number: item.track_number,
                            title: item.name,
                            artists: item.artists,
                            album: item.album,
                            duration_ms: item.duration_ms.totalMilliseconds || item.duration_ms,
                            genres: ['rock', 'pop'], // To-Do: pobierz z Discogs (?)
                            dateAdded: item.added_at,
                            explicit: item.explicit,
                            playable: item.is_playable,
                            local: item.is_local
                        })),
                        releaseDate: data.release_date
                    }
                    setAlbum(album);
                })
                .catch(console.error);
        }
    }

    useEffect(() => {
        getAlbum();
    },[])

    // #region Struktura komponentu (JSX)
    return (
        <div id = 'page'>
            <NavBar />
            <CatalogBrowser className = 'playlistBrowser'>
                <TrackList tracks = {album.tracks} for = 'album' />
                <PlaylistOverview playlist = {album} for = 'album' />
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

export default Album;