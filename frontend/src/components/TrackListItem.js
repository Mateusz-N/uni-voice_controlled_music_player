import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { millisecondsToFormattedTime } from 'common/auxiliaryFunctions';

import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';
import btn_play from 'resources/btn_play.svg';
import btn_pause from 'resources/btn_pause.svg';

import Styles from 'components/TrackListItem.module.scss';

const TrackListItem = (props) => {
    // #region Zmienne globalne
    const track = props.track
    const index = props.index;
    const playing = props.playing;
    const handleToggleTrackPlayback = props.trackPlaybackToggleHandler;
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
            {props.for === 'playlist' ?
                <>
                    <td>
                        {track.artists[0].name ? track.artists.map((artist, index) => {
                            return(
                                <Fragment key = {index}>
                                    <Link to = {'./artist/' + artist.id}>{artist.name}</Link>
                                    {index === track.artists.length - 1 ? '' : ', '}
                                </Fragment>
                            )
                        }) : '?'}
                    </td>
                    <td>
                        <div className = {Styles.trackList_item_album}>
                            <Link to = {'/album/' + track.album.id}>
                                <img src = {track.album.images.length > 0 ? track.album.images[0].url : placeholderAlbumCoverSrc} alt = {track.album.name} className = {Styles.trackList_item_albumCover}/>
                            </Link>
                            <p>
                                {track.album.name ? <Link to = {'/album/' + track.album.id}>{track.album.name}</Link> : '?'}
                            </p>
                        </div>
                    </td>
                    <td>{track.album.release_date ? track.album.release_date.split('-').shift() : '?'}</td>
                </>
            : null}
            <td>{track.genres.join(', ')}</td>
            <td>{millisecondsToFormattedTime(track.duration_ms)}</td>
            {props.for === 'playlist' ?
                <td>{new Date(track.dateAdded).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</td>
            : null}
        </tr>
    );
    // #endregion
}

export default TrackListItem;