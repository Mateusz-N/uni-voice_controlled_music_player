import { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { millisecondsToFormattedTime } from 'common/auxiliaryFunctions';

import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';
import btn_play from 'resources/btn_play.svg';
import btn_pause from 'resources/btn_pause.svg';

import Styles from 'components/TrackListItem.module.scss';
import KebabMenu from './KebabMenu';

const TrackListItem = (props) => {
    // #region Zmienne globalne
    const track = props.track
    const index = props.index;
    const playing = props.playing;
    const handleToggleTrackPlayback = props.onPlaybackToggle;
    // #endregion

    const [trackSaved, setTrackSaved] = useState(track.saved);

    const handleToggleTrackSaved = () => {
        const initiallySaved = trackSaved;
        setTrackSaved(prevState => !prevState);
        fetch(`${process.env.REACT_APP_SERVER_URL}/spotify/tracks/saved?ids=${track.id}`, {
            method: initiallySaved ? 'DELETE' : 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then((response) => {
                if(response.ok) {
                    return response.json();
                }
                if(response.status === 401) {
                    throw new Error('Invalid access token!');
                }
            })
            .then((data) => {
                console.info(data.message);
            })
            .catch(console.error);
    }

    // #region Przypisanie dynamicznych elementów komponentu, obsługa wartości null/undefined
    let albumColumn = null;
    let releaseDateColumn = null;
    let dateAddedColumn = null;
    let artistsColumnContents = '?';
    let trackArtists = [];
    let trackAlbum = {
        id: null,
        name: '?',
        images: [],
        release_date: '?'
    };
    let contextMenu_savedTracksAction = <li id = {Styles.trackList_item_contextMenu_addToFavorites} onClick = {handleToggleTrackSaved}>Add to favorites</li>;
    if(trackSaved) {
        contextMenu_savedTracksAction = <li id = {Styles.trackList_item_contextMenu_removeFromFavorites} onClick = {handleToggleTrackSaved} dangerous = 'true'>Remove from favorites</li>
    }
    let kebabMenu = null;
    if(!track.local) {
        kebabMenu = 
            <KebabMenu
                context = 'trackList_item'
                kebabBtnID = {'trackList_item_btnKebab_' + index} // track.id jest zawodne, gdyż pliki lokalne nie posiadają ID
                styles = {Styles}>
                {contextMenu_savedTracksAction}
                <li id = {Styles.trackList_item_contextMenu_addToPlaylist}>Add to playlist...</li>
            </KebabMenu>
    }
    if(track && Object.keys(track).length > 0) {
        if(track.artists) {
            trackArtists = track.artists;
        }
        if(trackArtists[0].name.length > 0) {
            artistsColumnContents = trackArtists.map((artist, index) => {
                return(
                    <Fragment key = {index}>
                        <Link to = {'/artist/' + artist.id}>{artist.name}</Link>
                        {index === trackArtists.length - 1 ? '' : ', '}
                    </Fragment>
                )
            });
        }
        if(track.album) {
            if(track.album.id) {
                trackAlbum.id = track.album.id;
            }
            if(track.album.name) {
                trackAlbum.name = track.album.name;
            }
            if(track.album.images) {
                trackAlbum.images = track.album.images;
            }
            if(track.album.release_date) {
                trackAlbum.release_date = track.album.release_date;
            }
        }
    }
    if(props.for === 'playlist') {
        let albumName = trackAlbum.name;
        let releaseDateColumnContents = trackAlbum.release_date;
        const dateAddedColumnContents = new Date(track.dateAdded).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'});

        if(trackAlbum.id && trackAlbum.name !== '?') {
            albumName = <Link to = {'/album/' + trackAlbum.id}>{trackAlbum.name}</Link>
        }
        const albumColumnContents =
            <div className = {Styles.trackList_item_album}>
                <Link to = {'/album/' + trackAlbum.id}>
                    <img src = {trackAlbum.images.length > 0 ? trackAlbum.images[0].url : placeholderAlbumCoverSrc} alt = {trackAlbum.name} className = {Styles.trackList_item_albumCover}/>
                </Link>
                <p>
                    {albumName}
                </p>
            </div>
        if(releaseDateColumnContents !== '?') {
            releaseDateColumnContents = trackAlbum.release_date.split('-').shift();
        }
        albumColumn = <td>{albumColumnContents}</td>;
        releaseDateColumn = <td>{releaseDateColumnContents}</td>;
        dateAddedColumn = <td>{dateAddedColumnContents}</td>;
    }
    // #endregion
    
    // #region Struktura komponentu (JSX)
    return(
        <tr key = {index} className = {Styles.trackList_item}>
            <td>{index + 1}</td>
            <td>
                <div className = {Styles.trackList_item_title}>
                    <img
                        src = {playing ?  btn_pause : btn_play}
                        alt = {playing ? 'Pause' : 'Play'}
                        className = {Styles.trackList_item_btnTogglePlayback + ' ' + (playing ? Styles.trackList_item_btnPause : Styles.trackList_item_btnPlay)}
                        onClick = {() => handleToggleTrackPlayback(index)}
                    />
                    <p className = {Styles.trackList_item_titleText} onClick = {() => handleToggleTrackPlayback(index)}>{track.title}</p>
                </div>
            </td>
            <td>{artistsColumnContents}</td>
            {albumColumn}
            {releaseDateColumn}
            <td>{track.genres.join(', ')}</td>
            <td>{millisecondsToFormattedTime(track.duration_ms)}</td>
            {dateAddedColumn}
            <td className = {Styles.trackList_item_tdKebab}>
                {kebabMenu}
            </td>
        </tr>
    );
    // #endregion
}

export default TrackListItem;