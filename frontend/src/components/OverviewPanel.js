import { useState } from 'react';

import btn_play from 'resources/btn_play.svg';
import btn_pause from 'resources/btn_pause.svg';

import OverviewPanelDetails from 'components/OverviewPanelDetails';

import Styles from 'components/OverviewPanel.module.scss';

const OverviewPanel = (props) => {
    const [playlistPaused, setPlaylistPaused] = useState(true);

    // #region Obsługa zdarzeń (Event Handlers)
    const handleTogglePlaylistPlayback = () => {
        setPlaylistPaused(prevState => !prevState);
    }
    // #endregion

    const data = props.data;

    // #region Struktura komponentu (JSX)
    return(
        <aside id = {Styles.overviewPanel}>
            <main id = {Styles.overviewPanel_mainSection}>
                <figure id = {Styles.playlistFigure}>
                    <img src = {data.thumbnailSrc} alt = {data.name} id = {Styles.playlistFigure_thumbnail} />
                    <figcaption id = {Styles.playlistFigcaption}>
                        <img
                            src = {playlistPaused ? btn_play : btn_pause}
                            alt = {playlistPaused ? 'Play' : 'Pause'}
                            id = {playlistPaused ? Styles.playlist_btnPlay : Styles.playlist_btnPause}
                            className = {Styles.playlist_btnTogglePlayback}
                            onClick = {handleTogglePlaylistPlayback}
                        />
                        <h3 id = {Styles.playlistName}>{data.name}</h3>
                    </figcaption>
                </figure>
                <hr/>
                <OverviewPanelDetails items = {data.detailsToDisplay} for = {props.for} />
            </main>
            <hr/>
            <section id = {Styles.playlistDescription}>
                <p>{data.description}</p>
            </section>
        </aside>
    );
    // #endregion
}

export default OverviewPanel;