import { Link } from 'react-router-dom';

import Styles from './TrackListItem.module.scss';

import btn_play from '../resources/btn_play.svg';
import btn_pause from '../resources/btn_pause.svg';

const TrackListItem = (props) => {
    const track = props.track
    const index = props.index;
    const playing = props.playing;
    const handleToggleTrackPlayback = props.trackPlaybackToggleHandler;
    
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
                        {track.artists.map((artist, index) => {
                            return(
                                <>
                                    <Link key = {index} to = {'./artist/' + artist.id}>{artist}</Link>
                                    {index === track.artists.length - 1 ? '' : ', '}
                                </>
                            )
                        })}
                    </td>
                    <td>
                        <div className = {Styles.trackList_item_album}>
                            <Link to = {'/album/' + track.album.id}>
                                <img src = {track.album.coverSrc} alt = {track.album.name} className = {Styles.trackList_item_albumCover}/>
                            </Link>
                            <p>
                                <Link to = {'/album/' + track.album.id}>{track.album.name}</Link>
                            </p>
                        </div>
                    </td>
                    <td>{track.year}</td>
                </>
            : null}
            <td>{track.genre}</td>
            <td>{track.duration}</td>
            {props.for === 'playlist' ?
                <td>{track.added.toDateString()}</td>
            : null}
        </tr>
    );
}

export default TrackListItem;