import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

import NavBar from 'components/NavBar';
import PlaybackPanel from 'components/PlaybackPanel';
import CatalogBrowser from 'components/CatalogBrowser';
import TrackList from 'components/TrackList';
import PlaylistOverview from 'components/PlaylistOverview';

const Playlist = () => {
    const [playlist, setPlaylist] = useState({tracks: []});
    const getPlaylist = () => {
        if(Cookies.get('userID')) {
            const playlistID = window.location.href.split('/').pop();
            fetch(`http://localhost:3030/spotify/playlist/${playlistID}`, {
                method: 'GET',
                credentials: 'include'
            })
                .then((response) => {
                    if(response.ok) {
                        return response.json()
                    }
                })
                .then((data) => {
                    const playlist = playlistID == 1 ? {
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
                    setPlaylist(playlist);
                })
                .catch(console.error);
        }
    }

    useEffect(() => {
        getPlaylist();
    },[])

    const sampleSongs = [{ id: "aR5rHG1", title: "Song 1", artists: ["Artist 1"], album: {coverSrc: placeholderAlbumCoverSrc, name: "Album 1"}, year: 1995, genre: "rock", duration: 240000, added: new Date("2023-07-01") },
    { id: "aR5rHG2", title: "Song 222222222222222222222222222222222222", artists: ["Artist 2222222222222222222222222222"], album: {coverSrc: placeholderAlbumCoverSrc, name: "Album 232ff3322343235564351"}, year: 20082222222222222222222222222222, genre: "pop2222222222222222222222222222", duration: 1800002222222222222222222222222222, added: new Date("2023-07-02") },
    { id: "aR5rHG3", title: "Song 3", artists: ["Artist 3"], album: "Album 3", year: 2012, genre: "hip-hop", duration: 200000, added: new Date("2023-07-03") }];

    return (
        <div id = 'page'>
            <NavBar />
            <CatalogBrowser className = 'playlistBrowser'>
                <TrackList tracks = {playlist.tracks} for = 'playlist' />
                <PlaylistOverview playlist = {playlist} for = 'playlist' />
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

export default Playlist;