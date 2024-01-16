import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import { requestGetPlaylists } from 'common/serverRequests';

import TrackListItem from 'components/TrackList/TrackListItem';

import Styles from 'components/TrackList/TrackList.module.scss';

const TrackList = (props) => {
    // #region Zmienne globalne
    const playlist = props.playlist;
    let playingTrackID = props.playingTrackID;
    let playingTrackEnded = props.playingTrackEnded;
    let tracks = [];
    let thAlbum = null;
    let thYear = null;
    let thAdded = null;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [userPlaylists, setUserPlaylists] = useState([]);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleToggleTrackPlayback = (track) => {
        if(props.for === 'album') {
          track.album = playlist;
        }
        props.onPlaybackToggle(track);
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        const loggedIn = !!Cookies.get('userID');
        if(!loggedIn) {
            return;
        }
        requestGetPlaylists((data) => {
            setUserPlaylists(data);
        });
    },[]);
    useEffect(() => {
        if(playingTrackEnded) {
          const nextTrackIndex = tracks.indexOf(tracks.find(track => track.id === playingTrackID)) + 1;
          const nextTrack = tracks[nextTrackIndex];
          handleToggleTrackPlayback(nextTrack);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [playingTrackEnded, playingTrackID, tracks]);
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu, obsługa wartości null/undefined
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
                    {/* <th>Genre</th> */}{/*   Spotify API obecnie nie dostarcza gatunków utworów w punkcie końcowym pobierania list odtwarzania...
                                                Udostępnia je w punkcie końcowym pobierania utworu...
                                                Jednak dla dużych list odtwarzania byłoby to bardzo kosztowne */}
                    <th>Duration</th>
                    {thAdded}
                    <th className = {Styles.thKebab}></th>
                </tr>
            </thead>
            <tbody>
                {tracks.map((track, index) => {
                    const playing = playingTrackID === track.id;
                    return <TrackListItem
                        key = {index}
                        track = {track}
                        index = {index}
                        for = {props.for}
                        playlist = {playlist}
                        playing = {playing}
                        userPlaylists = {userPlaylists}
                        onPlaybackToggle = {handleToggleTrackPlayback}
                        onPlaylistUpdate = {props.onPlaylistUpdate}
                    />
                })}
            </tbody>
        </table>
    );
    // #endregion
}

export default TrackList;