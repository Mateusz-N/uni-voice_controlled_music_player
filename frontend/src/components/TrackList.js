import { Link } from 'react-router-dom';

import Styles from './TrackList.module.scss';

import btn_play from '../resources/btn_play.svg';

const TrackList = (props) => {
    const tracks = props.tracks;

    const handlePlayTrack = () => {
        // To-do
    }

    return(
        <table id = {Styles.trackList}>
            <thead>
                <tr id = {Styles.trackList_header}>
                    <th>#</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Album</th>
                    <th>Year</th>
                    <th>Genre</th>
                    <th>Duration</th>
                    <th>Added</th>
                </tr>
            </thead>
            <tbody>
                {tracks.map((track, index) => {
                    return(
                        <tr key = {index} className = {Styles.trackList_item}>
                            <td>{index + 1000}</td>
                            <td>
                                <div className = {Styles.trackList_item_title}>
                                    <img src = {btn_play} alt = 'Play' className = {Styles.trackList_item_btnPlay} />
                                    <p className = {Styles.trackList_item_titleText} onClick = {handlePlayTrack}>{track.title}</p>
                                </div>
                            </td>
                            <td>
                                <Link to = {'./artist/' + track.artist.id}>{track.artist}</Link>
                            </td>
                            <td>
                                <div className = {Styles.trackList_item_album}>
                                    <Link to = {'./playlist/' + track.album.id}><img src = {track.album.coverSrc} alt = {track.album.name} className = {Styles.trackList_item_albumCover}/></Link>
                                    <p><Link to = {'./playlist/' + track.album.id}>{track.album.name}</Link></p>
                                </div>
                            </td>
                            <td>{track.year}</td>
                            <td>{track.genre}</td>
                            <td>{track.duration}</td>
                            <td>{track.added.toDateString()}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
}

export default TrackList;