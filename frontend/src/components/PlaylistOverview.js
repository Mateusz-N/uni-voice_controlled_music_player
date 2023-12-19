import { useState } from 'react';

import btn_play from 'resources/btn_play.svg';
import btn_pause from 'resources/btn_pause.svg';

import PlaylistDetails from 'components/PlaylistDetails';

import Styles from 'components/PlaylistOverview.module.scss';

const PlaylistOverview = (props) => {
    const [playlistPaused, setPlaylistPaused] = useState(true);

    // #region Obsługa zdarzeń (Event Handlers)
    const handleTogglePlaylistPlayback = () => {
        setPlaylistPaused(prevState => !prevState);
    }
    // #endregion

    // #region Obsługa wartości null/undefined
    const playlist = props.playlist;
    let playlistName = 'Unknown playlist';
    let playlistThumbnailSrc = '';
    let playlistDescription = '';
    if(playlist && Object.keys(playlist).length > 0) {
        playlistName = playlist.name;
        playlistThumbnailSrc = playlist.thumbnailSrc;
        playlistDescription = playlist.description;
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <aside id = {Styles.playlistOverview}>
            <main id = {Styles.playlistOverview_mainSection}>
                <figure id = {Styles.playlistFigure}>
                    <img src = {playlistThumbnailSrc} alt = {playlistName} id = {Styles.playlistFigure_thumbnail} />
                    <figcaption id = {Styles.playlistFigcaption}>
                        <img
                            src = {playlistPaused ? btn_play : btn_pause}
                            alt = {playlistPaused ? 'Play' : 'Pause'}
                            id = {playlistPaused ? Styles.playlist_btnPlay : Styles.playlist_btnPause}
                            className = {Styles.playlist_btnTogglePlayback}
                            onClick = {handleTogglePlaylistPlayback}
                        />
                        <h3 id = {Styles.playlistName}>{playlistName}</h3>
                    </figcaption>
                </figure>
                <hr/>
                <PlaylistDetails playlist = {playlist} for = {props.for} />
            </main>
            <hr/>
            <section id = {Styles.playlistDescription}>
                <p>{playlistDescription}</p>
            </section>
        </aside>
    );
    // #endregion
}

export default PlaylistOverview;