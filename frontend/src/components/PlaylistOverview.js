import { useState } from 'react';
import { Link } from 'react-router-dom';

import btn_play from 'resources/btn_play.svg';
import btn_pause from 'resources/btn_pause.svg';

import Styles from 'components/PlaylistOverview.module.scss';

const PlaylistOverview = (props) => {
    const [playlistPaused, setPlaylistPaused] = useState(true);

    // #region Obsługa zdarzeń (Event Handlers)
    const handleTogglePlaylistPlayback = () => {
        setPlaylistPaused(prevState => !prevState);
    }
    // #endregion

    const playlist = props.playlist;

    // #region Struktura komponentu (JSX)
    return(
        <aside id = {Styles.playlistOverview}>
            <main id = {Styles.playlistOverview_mainSection}>
                <figure id = {Styles.playlistFigure}>
                    <img src = {playlist.thumbnailSrc} alt = {playlist.name} id = {Styles.playlistFigure_thumbnail} />
                    <figcaption id = {Styles.playlistFigcaption}>
                        <img
                            src = {playlistPaused ? btn_play : btn_pause}
                            alt = {playlistPaused ? 'Play' : 'Pause'}
                            id = {playlistPaused ? Styles.playlist_btnPlay : Styles.playlist_btnPause}
                            className = {Styles.playlist_btnTogglePlayback}
                            onClick = {handleTogglePlaylistPlayback}
                        />
                        <h3 id = {Styles.playlistName}>{playlist.name}</h3>
                    </figcaption>
                </figure>
                <hr/>
                <ul id = {Styles.playlistDetails}>
                    {props.for === 'album' ?
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
                        </li>
                    : null}
                    <li>
                        <span className = {Styles.playlistDetails_detailName}>Track count: </span>
                        {playlist.tracks.length}
                    </li>
                    <li>
                        <span className = {Styles.playlistDetails_detailName}>Total duration: </span>
                        {playlist.totalDuration}
                    </li>
                    {props.for === 'playlist' ?
                        <>
                            <li>
                                <span className = {Styles.playlistDetails_detailName}>Created: </span>
                                {playlist.dateCreated.toDateString()}
                            </li>
                            <li>
                                <span className = {Styles.playlistDetails_detailName}>Last modified: </span>
                                {playlist.dateModified.toDateString()}
                            </li>
                        </>
                        :
                        <li>
                            <span className = {Styles.playlistDetails_detailName}>Released: </span>
                            {playlist.releaseDate.toDateString()}
                        </li>
                    }
                </ul>
            </main>
            <hr/>
            <section id = {Styles.playlistDescription}>
                <p>{playlist.description}</p>
            </section>
        </aside>
    );
    // #endregion
}

export default PlaylistOverview;