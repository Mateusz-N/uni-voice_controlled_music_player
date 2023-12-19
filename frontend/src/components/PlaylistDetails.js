import { Link } from 'react-router-dom';

import { millisecondsToFormattedTime } from 'common/auxiliaryFunctions';

import Styles from 'components/PlaylistDetails.module.scss';

const PlaylistDetails = (props) => {
    const playlist = props.playlist;

    // #region Przypisanie dynamicznych elementów komponentu, obsługa wartości null/undefined
    let liArtists = null;
    let liOwner = null;
    let liPublic = null;
    let liReleased = null;
    let playlistTotalDuration_ms = 0;
    let playlistTracks = [];
    if(playlist && Object.keys(playlist).length > 0) {
        playlistTotalDuration_ms = playlist.totalDuration_ms;
        if(playlist.tracks) {
            playlistTracks = playlist.tracks;
        }
        if(props.for === 'album') {
            liArtists =
                <li>
                    <span className = {Styles.playlistDetails_detailName}>Artist(s): </span>
                    {playlist.artists.map((artist, index) => {
                        return(
                            <>
                                <Link key = {index} to = {'./artist/' + artist.id}>{artist}</Link>
                                {index === playlist.artists.length - 1 ? '' : ', '}
                            </>
                        )
                    })}
                </li>;
            liReleased =
                <li>
                    <span className = {Styles.playlistDetails_detailName}>Released: </span>
                    {playlist.releaseDate.toDateString()}
                </li>;
        }
        else if(props.for === 'playlist') {
            liOwner =
                <li>
                    <span className = {Styles.playlistDetails_detailName}>Owner: </span>
                    {playlist.owner}
                </li>;
            liPublic =
                <li>
                    <span className = {Styles.playlistDetails_detailName}>Public: </span>
                    {playlist.public ? 'yes' : 'no'}
                </li>;
        }
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <ul id = {Styles.playlistDetails}>
            {liArtists}
            <li>
                <span className = {Styles.playlistDetails_detailName}>Track count: </span>
                {playlistTracks.length}
            </li>
            <li>
                <span className = {Styles.playlistDetails_detailName}>Total duration: </span>
                {millisecondsToFormattedTime(playlistTotalDuration_ms)}
            </li>
            {liOwner}
            {liPublic}
            {liReleased}
        </ul>
    );
    // #endregion
}

export default PlaylistDetails;