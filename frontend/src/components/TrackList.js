import { useState } from 'react';

import TrackListItem from 'components/TrackListItem';

import Styles from 'components/TrackList.module.scss';

const TrackList = (props) => {
    const [playingTrackID, setPlayingTrackID] = useState(null);

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

    // #region Przypisanie dynamicznych elementów komponentu, obsługa wartości null/undefined
    let tracks = [];
    let liArtists = null;
    let liAlbum = null;
    let liYear = null;
    let liAdded = null;
    if(props.tracks) {
        tracks = props.tracks;
        if(props.for === 'playlist') {
            liArtists = <th>Artist(s)</th>;
            liAlbum = <th>Album</th>;
            liYear = <th>Year</th>;
            liAdded = <th>Added</th>;
        }
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <table id = {Styles.trackList}>
            <thead>
                <tr id = {Styles.trackList_header}>
                    <th>#</th>
                    <th>Title</th>
                    {liArtists}
                    {liAlbum}
                    {liYear}
                    <th>Genre</th>
                    <th>Duration</th>
                    {liAdded}
                </tr>
            </thead>
            <tbody>
                {tracks.map((track, index) => {
                    const playing = playingTrackID === index;
                    return <TrackListItem key = {index} track = {track} index = {index} for = {props.for} playing = {playing} trackPlaybackToggleHandler = {handleToggleTrackPlayback} />
                })}
            </tbody>
        </table>
    );
    // #endregion
}

export default TrackList;