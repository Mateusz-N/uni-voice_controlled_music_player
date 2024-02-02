import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Cookies from 'js-cookie';

import { requestGetPlaylists } from 'common/serverRequests';

import TrackListItem from 'components/TrackList/TrackListItem';
import Loading from 'components/generic/Loading';
import Toast from 'components/generic/Toast';

import Styles from 'components/TrackList/TrackList.module.scss';

const TrackList = (props) => {
    // #region Zmienne globalne
    const playlist = props.playlist;
    const defaultPlayingTrack = props.defaultPlayingTrack;
    const defaultSelectAction = props.defaultSelectAction;
    const defaultFormAction = props.defaultFormAction;
    const defaultTrackInPlaylistAction = props.defaultTrackInPlaylistAction;
    const defaultTrackDetailsDisplay = props.defaultTrackDetailsDisplay;
    let playingTrack = props.playingTrack;
    let tracks = [];
    let thAlbum = null;
    let thYear = null;
    let thAdded = null;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [notification, setNotification] = useState({});
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleToggleTrackPlayback = (track) => {
        if(props.for === 'album') {
          track.album = playlist;
        }
        track.playlistID = playlist.id;
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
        if(playingTrack.ended) {
            let nextTrackIndex = tracks.indexOf(tracks.find(track => track.id === playingTrack.id));
            let nextTrack;
            do {
                nextTrackIndex++;
                if(nextTrackIndex >= tracks.length) {
                    nextTrackIndex = 0;
                }
                nextTrack = tracks[nextTrackIndex];
            }
            while(nextTrack.local);
            handleToggleTrackPlayback(nextTrack);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [playingTrack, tracks]);
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
    let loadingIcon = null;
    if(props.playlistLoading) {
        loadingIcon = <Loading />
    }
    let toastNotification = null;
    if(notification.message) {
        toastNotification =
            createPortal(<Toast message = {notification.message} type = {notification.type} onAnimationEnd = {() => setNotification({})} />, document.body);
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <>
            {toastNotification}
            <main id = {Styles.trackList_container}>
                {loadingIcon}
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
                            let defaultPlaying = null;
                            if(defaultPlayingTrack.id != null) {
                                defaultPlaying = (defaultPlayingTrack.id === track.id && !defaultPlayingTrack.paused && defaultPlayingTrack.playlistID === playlist.id);
                            }
                            let defaultDisplayDetails = null;
                            if(defaultTrackDetailsDisplay.trackID != null) {
                                defaultDisplayDetails = (defaultTrackDetailsDisplay.trackID === track.id);
                            }
                            let defaultPlaylistAction = null;
                            if(defaultTrackInPlaylistAction.trackID === track.id) {
                                defaultPlaylistAction = defaultTrackInPlaylistAction;
                            }
                            const playing = (playingTrack.id === track.id && !playingTrack.paused && playingTrack.playlistID === playlist.id);
                            return <TrackListItem
                                key = {index}
                                track = {track}
                                index = {index}
                                for = {props.for}
                                playlist = {playlist}
                                defaultPlaying = {defaultPlaying}
                                defaultSelectAction = {defaultSelectAction}
                                defaultFormAction = {defaultFormAction}
                                defaultPlaylistAction = {defaultPlaylistAction}
                                defaultDisplayDetails = {defaultDisplayDetails}
                                playing = {playing}
                                userPlaylists = {userPlaylists}
                                onPlaybackToggle = {handleToggleTrackPlayback}
                                onPlaylistUpdate = {props.onPlaylistUpdate}
                                onSelectAction = {props.onSelectAction}
                                onTrackDetailsModalClose = {props.onTrackDetailsModalClose}
                                onTrackInPlaylistAction = {(props.onTrackInPlaylistAction)}
                                onNotification = {(notification) => setNotification(notification)}
                            />
                        })}
                    </tbody>
                </table>
            </main>
        </>
    );
    // #endregion
}

export default TrackList;