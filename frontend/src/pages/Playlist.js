import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import { millisecondsToFormattedTime } from 'common/auxiliaryFunctions';

import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar';
import PlaybackPanel from 'components/PlaybackPanel';
import CatalogBrowser from 'components/CatalogBrowser';
import TrackList from 'components/TrackList';
import OverviewPanel from 'components/OverviewPanel';

const Playlist = () => {
    const playlistID = window.location.href.split('/').pop();
    const [playlist, setPlaylist] = useState({
        id: playlistID,
        name: 'Unknkown playlist',
        thumbnailSrc: placeholderAlbumCoverSrc,
        description: '',
        totalDuration_ms: 'N/A',
        artists: [],
        tracks: [],
        owner: 'N/A',
        public: 'N/A',
        detailsToDisplay: []
    });
    const getPlaylist = () => {
        if(Cookies.get('userID')) {
            fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/playlist/${playlistID}`, {
                method: 'GET',
                credentials: 'include'
            })
                .then((response) => {
                    if(response.ok) {
                        return response.json()
                    }
                })
                .then((data) => {
                    const playlist = playlistID.toString() === '1' ? { // '1' === Polubione utwory
                        id: playlistID,
                        name: 'Saved tracks',
                        thumbnailSrc: placeholderAlbumCoverSrc,
                        description: '',
                        totalDuration_ms: data.items.reduce((totalDuration_ms, item) => totalDuration_ms + (item.track.duration_ms.totalMilliseconds || item.track.duration_ms), 0),
                        tracks: data.items.map(item => ({
                            id: item.track.id,
                            number: item.track.track_number,
                            title: item.track.name,
                            artists: item.track.artists,
                            album: item.track.album,
                            duration_ms: item.track.duration_ms.totalMilliseconds || item.track.duration_ms,
                            genres: ['rock', 'pop'], // To-Do: pobierz z Discogs (?)
                            dateAdded: item.added_at,
                            explicit: item.track.explicit,
                            playable: item.track.is_playable,
                            local: item.track.is_local
                        })),
                        owner: Cookies.get('userName'),
                        public: false
                    }
                    :
                    {
                        id: data.id,
                        name: data.name,
                        thumbnailSrc: (data.images.length > 0 ? data.images[0].url : placeholderAlbumCoverSrc),
                        description: data.description,
                        totalDuration_ms: data.tracks.items.reduce((totalDuration_ms, item) => totalDuration_ms + (item.track.duration_ms.totalMilliseconds || item.track.duration_ms), 0),
                        artists: data.artists,
                        tracks: data.tracks.items.map(item => ({
                            id: item.track.id,
                            number: item.track.track_number,
                            title: item.track.name,
                            artists: item.track.artists,
                            album: item.track.album,
                            duration_ms: item.track.duration_ms.totalMilliseconds || item.track.duration_ms,
                            genres: ['rock', 'pop'], // To-Do: pobierz z Discogs (?)
                            dateAdded: item.added_at,
                            explicit: item.track.explicit,
                            playable: item.track.is_playable,
                            local: item.track.is_local
                        })),
                        owner: data.owner.display_name,
                        public: data.public
                    }
                    playlist.detailsToDisplay = [{
                        name: 'Track count',
                        content: playlist.tracks ? playlist.tracks.length || 'N/A' : 'N/A'
                    }, {
                        name: 'Total Duration',
                        content: playlist.totalDuration_ms ? millisecondsToFormattedTime(playlist.totalDuration_ms) : 'N/A'
                    }, {
                        name: 'Owner',
                        content: playlist.owner || 'N/A'
                    }, {
                        name: 'Public',
                        content: (playlist.public === true) ? 'yes' : ((playlist.public === false) ? 'no' : 'N/A')
                    }]
                    setPlaylist(playlist);
                })
                .catch(console.error);
        }
    }

    useEffect(() => {
        getPlaylist();
    },[])

    // #region Struktura komponentu (JSX)
    return (
        <div id = 'page'>
            <NavBar />
            <CatalogBrowser className = 'playlistBrowser hasOverviewPanel'>
                <TrackList tracks = {playlist.tracks} for = 'playlist' />
                <OverviewPanel data = {playlist} for = 'playlist' />
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

export default Playlist;