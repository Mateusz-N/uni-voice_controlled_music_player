import { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { millisecondsToFormattedTime, updatePlayback, togglePlayback } from 'common/auxiliaryFunctions';

import btn_previous from 'resources/btn_previous.svg';
import btn_play from 'resources/btn_play.svg';
import btn_pause from 'resources/btn_pause.svg';
import btn_next from 'resources/btn_next.svg';
import volume_75_100 from 'resources/volume_75_100.svg';
import volume_50_75 from 'resources/volume_50_75.svg';
import volume_25_50 from 'resources/volume_25_50.svg';
import volume_0_25 from 'resources/volume_0_25.svg';
import volume_muted from 'resources/volume_muted.svg';

import Styles from 'components/PlaybackPanel.module.scss'

const PlaybackPanel = (props) => {
    // #region Zmienne stanu (useState Hooks)
    const [timer, setTimer] = useState(null);
    const [currentTimestamp_ms, setCurrentTimestamp] = useState(0);
    const [targetTimestamp_ms, setTargetTimestamp] = useState(0);   // Docelowy punkt w czasie w przypadku przeciągania paska postępu
                                                                    // (użytkownik może dowolnie pasek przesuwać, w międzyczasie muzyka nadal gra zgodnie z domyślnym biegiem)
    const [paused, setPaused] = useState(true);
    const [progressBarPreviewWidth, setProgressBarPreviewWidth] = useState(0);
    const [progressBarInDragMode, setProgressBarInDragMode] = useState(false);
    const [volumePercentage, setVolumePercentage] = useState(100);
    const [volumeBuffer, setVolumeBuffer] = useState(0);
    // #endregion

    // #region Zmienne globalne
    const track = props.track;
    const trackDuration_ms = parseInt(track.duration_ms);
    let targetTimestamp_formatted = millisecondsToFormattedTime(targetTimestamp_ms);
    let trackDuration_formatted = millisecondsToFormattedTime(trackDuration_ms);
    // #endregion
    
    // #region Obsługa zdarzeń (Event Handlers)
    const handleUpdateTimer = (newTimer) => {
        if(newTimer === -1) {
            clearTimeout(timer)
        }
        else {
            setTimer(newTimer);
        }
    }
    const handleUpdateTargetTimestamp = (newTargetTimestamp_ms) => {
        if(newTargetTimestamp_ms < 0) {
            newTargetTimestamp_ms = 0;
        }
        if(newTargetTimestamp_ms > trackDuration_ms) {
            newTargetTimestamp_ms = trackDuration_ms;
        }
        setTargetTimestamp(newTargetTimestamp_ms);
    }
    const handleTogglePause = () => {
        setPaused(prevState => !prevState);
    }
    const handlePreviousTrack = () => {
        // to-do
    }
    const handleNextTrack = () => {
        // to-do
    }
    const getRelativeProgressBarPointPosition = (event) => {
        const progressBarBoundingRect = document.getElementById(Styles.progressBar).getBoundingClientRect();
        return (event.clientX - progressBarBoundingRect.left) / progressBarBoundingRect.width; // Część całości paska na którą wskazuje zdarzenie [0, 1]
    }
    const handleProgressBarMouseDown = (event) => {
        if(event.button === 0) { // Tylko lewy przycisk myszy
            setProgressBarInDragMode(true);
            clearTimeout(timer);
            const newTime = getRelativeProgressBarPointPosition(event) * trackDuration_ms;
            handleUpdateTargetTimestamp(newTime);
        }
    }
    const handleProgressBarHover = (event) => {
        if(event.type === 'mouseout') {
            setProgressBarPreviewWidth(0);
        }
        else {
            const progressBarPercentageHovered = getRelativeProgressBarPointPosition(event) * 100;
            setProgressBarPreviewWidth(progressBarPercentageHovered);
        }
    }
    const handleProgressBarDrag = (event) => {
        if(progressBarInDragMode) {
            // clearTimeout(timer);
            const newTime = getRelativeProgressBarPointPosition(event) * trackDuration_ms;
            handleUpdateTargetTimestamp(newTime);
        }
    }
    const handleProgressBarMouseUp = () => {
        if(progressBarInDragMode) {
            setProgressBarInDragMode(false);
            document.removeEventListener('mousemove', handleProgressBarDrag);
            document.removeEventListener('mouseup', handleProgressBarMouseUp);
        }
    }
    const handleChangeVolume = (event) => {
        setVolumePercentage(event.target.value);
    }
    const handleToggleMute = () => {
        const prevVolumePercentage = volumePercentage;
        setVolumePercentage(volumeBuffer);
        setVolumeBuffer(prevVolumePercentage);
    }
    // #endregion

    const determineVolumeIcon = () => {
        if(volumePercentage <= 100 && volumePercentage > 75) {
            return volume_75_100;
        }
        else if(volumePercentage <= 75 && volumePercentage > 50) {
            return volume_50_75;
        }
        else if(volumePercentage <= 50 && volumePercentage > 25) {
            return volume_25_50;
        }
        else if(volumePercentage <= 25 && volumePercentage > 0) {
            return volume_0_25;
        }
        else {
            return volume_muted;
        }
    }

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(!paused) {
            updatePlayback(trackDuration_ms, currentTimestamp_ms, setCurrentTimestamp, handleUpdateTimer, handleTogglePause);
        }
        if(currentTimestamp_ms !== targetTimestamp_ms) {
            handleUpdateTargetTimestamp(currentTimestamp_ms);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTimestamp_ms])
    useEffect(() => {
        togglePlayback(paused, trackDuration_ms, currentTimestamp_ms, setCurrentTimestamp, handleUpdateTimer, handleTogglePause);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paused]);
    useEffect(() => {
        if(progressBarInDragMode) {
            document.addEventListener('mousemove', handleProgressBarDrag);
            document.addEventListener('mouseup', handleProgressBarMouseUp);
        }
        else {
            if(targetTimestamp_ms !== currentTimestamp_ms) {
                setCurrentTimestamp(targetTimestamp_ms);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progressBarInDragMode]);
    // #endregion
    
    // #region Struktura komponentu (JSX)
    return(
        <div id = {Styles.playbackPanel}>
            <aside id = {Styles.trackDetails}>
                <img src = {track.albumCoverSrc} alt = {Styles.albumTitle} id = {Styles.albumCover} />
                <section id = {Styles.trackProperties}>
                    <p id = {Styles.trackTitle} className = {Styles.trackProperty}>
                        <Link to = {'/track/' + track.trackID}>{track.trackTitle}</Link>
                    </p>
                    <p id = {Styles.artists} className = {Styles.trackProperty}>
                        {track.artists.map((artist, index) => {
                            return(
                                <Fragment key = {index}>
                                    <Link to = {'/artist/' + artist.id}>{artist}</Link>
                                    {index === track.artists.length - 1 ? '' : ', '}
                                </Fragment>
                            )
                        })}
                    </p>
                    <p id = {Styles.albumTitle} className = {Styles.trackProperty}><Link to = {'/album/' + track.albumID}>{track.albumTitle}</Link></p>
                </section>
            </aside>
            <main id = {Styles.mainSection}>
                <section id = {Styles.controlsSection}>
                    <img
                        src = {btn_previous}
                        alt = 'Previous track'
                        id = {paused ? Styles.btnPlay : Styles.btnPause}
                        className = {Styles.btnTogglePlayback}
                        onClick = {handlePreviousTrack}
                    />
                    <img
                        src = {paused ? btn_play : btn_pause}
                        alt = {paused ? 'Play' : 'Pause'}
                        id = {paused ? Styles.btnPlay : Styles.btnPause}
                        className = {Styles.btnTogglePlayback}
                        onClick = {handleTogglePause}
                    />
                    <img
                        src = {btn_next}
                        alt = 'Next track'
                        id = {paused ? Styles.btnPlay : Styles.btnPause}
                        className = {Styles.btnTogglePlayback}
                        onClick = {handleNextTrack}
                    />
                </section>
                <section id = {Styles.progressSection}>
                    <p id = {Styles.timeElapsed}>{targetTimestamp_formatted}</p>
                    <div
                        id = {Styles.progressBar}
                        onMouseDown = {event => handleProgressBarMouseDown(event)}
                        onMouseOver = {event => handleProgressBarHover(event)}
                        onMouseOut = {event => handleProgressBarHover(event)}
                        onMouseMove = {event => handleProgressBarHover(event)}
                    >
                        <div id = {Styles.progressBarPreview} style = {{width: progressBarPreviewWidth + '%'}} />
                        <div id = {Styles.progressBarFill} style = {{width: (targetTimestamp_ms / trackDuration_ms * 100) + '%'}} />
                    </div>
                    <p id = {Styles.trackDuration}>{trackDuration_formatted}</p>
                </section>
            </main>
            <aside id = {Styles.miscControls}>
                <section id = {Styles.volumeSection}>
                    <label htmlFor = {Styles.volumeBar} id = {Styles.volumeLabel}>
                        <img src = {determineVolumeIcon()} alt = {`Volume: ${volumePercentage}%`} id = {Styles.volumeIcon} onClick = {handleToggleMute}/>
                    </label>
                    <input
                        type = 'range'
                        min = '0'
                        max = '100'
                        step = '1'
                        value = {volumePercentage}
                        name = 'volumeBar'
                        id = {Styles.volumeBar}
                        onChange = {event => handleChangeVolume(event)}
                        style = {{background: `linear-gradient(to right, #FFF ${volumePercentage}%, #666 ${volumePercentage}%)`}}
                    />
                </section>
            </aside>
        </div>
    );
    // #endregion
}

export default PlaybackPanel;