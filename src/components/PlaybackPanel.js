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
    const [timeElapsed_ms, setTimeElapsed] = useState(0);
    const [paused, setPaused] = useState(true);
    
    const handleUpdateTimer = (newTimer) => {
        // console.log(timer)
        if(newTimer === -1) {
            clearTimeout(timer)
        }
        else {
            setTimer(newTimer);
        }
    }
    const handleUpdateTimeElapsed = (newTime) => {
        setTimeElapsed(newTime);
    }
    const handlePreviousTrack = () => {
        // to-do
    }
    const handleNextTrack = () => {
        // to-do
    }

    useEffect(() => {
        if(!paused) {
            updatePlayback(trackDuration_ms, timeElapsed_ms, handleUpdateTimeElapsed, handleUpdateTimer, handleTogglePause);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeElapsed_ms])
    const handleTogglePause = () => {
        setPaused(prevState => !prevState);
    }
    /* Oczekuje zakończenia wykonywania setPaused() */
    useEffect(() => {
        togglePlayback(paused, trackDuration_ms, timeElapsed_ms, handleUpdateTimeElapsed, handleUpdateTimer, handleTogglePause);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paused]);

    let timeElapsed_formatted = millisecondsToFormattedTime(timeElapsed_ms);
    let trackDuration_formatted = millisecondsToFormattedTime(trackDuration_ms);
    
    return(
        <div id = {Styles.playbackPanel}>
            <div id = {Styles.controlsSection}>
                <img src = {btn_previous} alt = 'Previous track' id = {paused ? Styles.btnPlay : Styles.btnPause} className = {Styles.btnTogglePlayback} onClick = {handlePreviousTrack} />
                <img src = {paused ? btn_play : btn_pause} alt = {paused ? 'Play' : 'Pause'} id = {paused ? Styles.btnPlay : Styles.btnPause} className = {Styles.btnTogglePlayback} onClick = {handleTogglePause} />
                <img src = {btn_next} alt = 'Next track' id = {paused ? Styles.btnPlay : Styles.btnPause} className = {Styles.btnTogglePlayback} onClick = {handleNextTrack} />
            </div>
            <div id = {Styles.progressSection}>
                <p id = {Styles.timeElapsed}>{timeElapsed_formatted}</p>
                <div id = {Styles.progressBar}>
                    <div id = {Styles.progressBarFill} style = {{width: (timeElapsed_ms / trackDuration_ms * 100) + '%'}}>

                    </div>
                </div>
                <p id = {Styles.trackDuration}>{trackDuration_formatted}</p>
            </div>
        </div>
    );
}

export default PlaybackPanel;