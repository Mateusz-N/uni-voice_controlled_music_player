import { useState } from 'react';

import TrackListItem from './TrackListItem';

import Styles from './TrackList.module.scss';

const TrackList = (props) => {
    const tracks = props.tracks;

    const [playingTrackID, setPlayingTrackID] = useState(null);

    const handleToggleTrackPlayback = (trackID) => {
        if(playingTrackID !== trackID) {
            setPlayingTrackID(trackID);
        }
        else {
            setPlayingTrackID(null);
        }
    }

    return(
        <table id = {Styles.trackList}>
            <thead>
                <tr id = {Styles.trackList_header}>
                    <th>#</th>
                    <th>Title</th>
                    {props.for === 'playlist' ?
                        <>
                            <th>Artist(s)</th>
                            <th>Album</th>
                            <th>Year</th>
                        </>
                    : null}
                    <th>Genre</th>
                    <th>Duration</th>
                    {props.for === 'playlist' ?
                        <th>Added</th>
                    : null}
                </tr>
            </thead>
            <tbody>
                {tracks.map((track, index) => {
                    const playing = playingTrackID == index;
                    return <TrackListItem key = {index} track = {track} index = {index} for = {props.for} playing = {playing} trackPlaybackToggleHandler = {handleToggleTrackPlayback} />
                })}
            </tbody>
        </table>
    );
}

export default TrackList;