import { useState, useEffect } from 'react';

import TrackListItem from 'components/TrackListItem';

import Styles from 'components/TrackList.module.scss';

const TrackList = (props) => {
    const [playingTrackID, setPlayingTrackID] = useState(null);
    const [userPlaylists, setUserPlaylists] = useState([]);

    // #region Obsługa zdarzeń (Event Handlers)
    const handleToggleTrackPlayback = (trackID) => {
        if(playingTrackID !== trackID) {
            setPlayingTrackID(trackID);
        }
        else {
            setPlayingTrackID(null);
        }
    }
    // #endregion

    const getUserPlaylists = () => {
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
                setUserPlaylists(data);
            })
            .catch(console.error);
    }

    useEffect(() => {
        getUserPlaylists();
    },[])

    // #region Przypisanie dynamicznych elementów komponentu, obsługa wartości null/undefined
    let tracks = [];
    let thAlbum = null;
    let thYear = null;
    let thAdded = null;
    if(props.tracks) {
        tracks = props.tracks;
    }
    if(props.for === 'playlist') {
        thAlbum = <th>Album</th>;
        thYear = <th>Year</th>;
        thAdded = <th>Added</th>;
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <table id = {Styles.trackList}>
            <thead>
                <tr id = {Styles.trackList_header}>
                    <th>#</th>
                    <th>Title</th>
                    <th>Artist(s)</th>
                    {thAlbum}
                    {thYear}
                    <th>Genre</th>
                    <th>Duration</th>
                    {thAdded}
                    <th className = {Styles.thKebab}></th>
                </tr>
            </thead>
            <tbody>
                {tracks.map((track, index) => {
                    const playing = playingTrackID === index;
                    return <TrackListItem
                                key = {index}
                                track = {track}
                                index = {index}
                                for = {props.for}
                                playing = {playing}
                                onPlaybackToggle = {handleToggleTrackPlayback}
                                userPlaylists = {userPlaylists}
                    />
                })}
            </tbody>
        </table>
    );
    // #endregion
}

export default TrackList;