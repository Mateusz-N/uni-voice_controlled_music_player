import { useEffect, useState } from 'react';

import { millisecondsToFormattedTime, updatePlayback, togglePlayback } from '../common/auxiliaryFunctions';
import Styles from './PlaybackPanel.module.scss'

import btn_previous from '../resources/btn_previous.svg';
import btn_play from '../resources/btn_play.svg';
import btn_pause from '../resources/btn_pause.svg';
import btn_next from '../resources/btn_next.svg';

const PlaybackPanel = () => {
    let trackDuration_ms = 15000;

    const [timer, setTimer] = useState(null);
    const [currentTimestamp_ms, setCurrentTimestamp] = useState(0);
    const [targetTimestamp_ms, setTargetTimestamp] = useState(0);   // Docelowy punkt w czasie w przypadku przeciągania paska postępu
                                                                    // (użytkownik może dowolnie pasek przesuwać, w międzyczasie muzyka nadal gra zgodnie z domyślnym biegiem)
    const [paused, setPaused] = useState(true);
    const [progressBarPreviewWidth, setProgressBarPreviewWidth] = useState(0);
    const [progressBarInDragMode, setProgressBarInDragMode] = useState(false);
    
    const handleUpdateTimer = (newTimer) => {
        if(newTimer === -1) {
            clearTimeout(timer)
        }
        else {
            setTimer(newTimer);
        }
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
        const progressBarBoundingRect = document.getElementById(Styles.progressBar).getBoundingClientRect(); // currentTarget przechwytuje źródłowy element (progressBar) zamiast wierzchniego (progressBarFill)
        return (event.clientX - progressBarBoundingRect.left) / progressBarBoundingRect.width; // Część całości paska na którą wskazuje zdarzenie [0, 1]
    }
    const handleProgressBarMouseDown = (event) => {
        if(event.button === 0) { // Tylko lewy przycisk myszy
            setProgressBarInDragMode(true);
            clearTimeout(timer);
            const newTime = getRelativeProgressBarPointPosition(event) * trackDuration_ms;
            setTargetTimestamp(newTime);
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
            clearTimeout(timer);
            const newTime = getRelativeProgressBarPointPosition(event) * trackDuration_ms;
            setTargetTimestamp(newTime);
        }
    }
    const handleProgressBarMouseUp = () => {
        if(progressBarInDragMode) {
            setProgressBarInDragMode(false);
            // setCurrentTimestamp(targetTimestamp_ms);
            document.removeEventListener('mousemove', handleProgressBarDrag);
            document.removeEventListener('mouseup', handleProgressBarMouseUp);
        }
    }

    useEffect(() => {
        if(!paused) {
            updatePlayback(trackDuration_ms, currentTimestamp_ms, setCurrentTimestamp, handleUpdateTimer, handleTogglePause);
        }
        setTargetTimestamp(currentTimestamp_ms);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progressBarInDragMode]);
    useEffect(() => {
        if(!progressBarInDragMode) {
            setCurrentTimestamp(targetTimestamp_ms);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetTimestamp_ms])

    let currentTimestamp_formatted = millisecondsToFormattedTime(currentTimestamp_ms);
    let trackDuration_formatted = millisecondsToFormattedTime(trackDuration_ms);
    
    return(
        <div id = {Styles.playbackPanel}>
            <div id = {Styles.controlsSection}>
                <img src = {btn_previous} alt = 'Previous track' id = {paused ? Styles.btnPlay : Styles.btnPause} className = {Styles.btnTogglePlayback} onClick = {handlePreviousTrack} />
                <img src = {paused ? btn_play : btn_pause} alt = {paused ? 'Play' : 'Pause'} id = {paused ? Styles.btnPlay : Styles.btnPause} className = {Styles.btnTogglePlayback} onClick = {handleTogglePause} />
                <img src = {btn_next} alt = 'Next track' id = {paused ? Styles.btnPlay : Styles.btnPause} className = {Styles.btnTogglePlayback} onClick = {handleNextTrack} />
            </div>
            <div id = {Styles.progressSection}>
                <p id = {Styles.timeElapsed}>{currentTimestamp_formatted}</p>
                <div
                    id = {Styles.progressBar}
                    onMouseDown = {event => handleProgressBarMouseDown(event)}
                    onMouseOver = {event => handleProgressBarHover(event)}
                    onMouseOut = {event => handleProgressBarHover(event)}
                    onMouseMove = {event => handleProgressBarHover(event)}
                >
                    <div id = {Styles.progressBarPreview} style = {{width: progressBarPreviewWidth + '%'}}>
                        
                    </div>
                    <div id = {Styles.progressBarFill} style = {{width: (targetTimestamp_ms / trackDuration_ms * 100) + '%'}}>

                    </div>
                </div>
                <p id = {Styles.trackDuration}>{trackDuration_formatted}</p>
            </div>
        </div>
    );
}

export default PlaybackPanel;