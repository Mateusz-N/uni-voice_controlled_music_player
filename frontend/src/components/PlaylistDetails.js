import { Fragment } from 'react';
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
    let playlistArtists = [];
    let playlistReleaseDate = '?';
    let playlistOwner = '?';
    let playlistPublic = '?';
    if(playlist && Object.keys(playlist).length > 0) {
        if(playlist.totalDuration_ms) {
            playlistTotalDuration_ms = playlist.totalDuration_ms;
        }
        if(playlist.tracks) {
            playlistTracks = playlist.tracks;
        }
        if(props.for === 'album') {
            if(playlist.artists) {
                playlistArtists = playlist.artists;
            }
            if(playlist.releaseDate) {
                playlistReleaseDate = new Date(playlist.releaseDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'});
            }
            liArtists =
                <li>
                    <span className = {Styles.playlistDetails_detailName}>Artist(s): </span>
                    {playlistArtists.map((artist, index) => {
                        return(
                            <Fragment key = {index}>
                                <Link to = {'./artist/' + artist.id}>{artist.name}</Link>
                                {index === playlistArtists.length - 1 ? '' : ', '}
                            </Fragment>
                        )
                    })}
                </li>;
            liReleased =
                <li>
                    <span className = {Styles.playlistDetails_detailName}>Released: </span>
                    {playlistReleaseDate}
                </li>;
        }
        else if(props.for === 'playlist') {
            if(playlist.owner) {
                playlistOwner = playlist.owner;
            }
            if(playlist.public) {
                playlistPublic = playlist.public ? 'yes' : 'no';
            }
            liOwner =
                <li>
                    <span className = {Styles.playlistDetails_detailName}>Owner: </span>
                    {playlistOwner}
                </li>;
            liPublic =
                <li>
                    <span className = {Styles.playlistDetails_detailName}>Public: </span>
                    {playlistPublic}
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