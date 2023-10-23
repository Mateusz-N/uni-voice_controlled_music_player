import { useEffect, useState } from 'react';

import Styles from './PlaybackPanel.module.scss'

const addLeadingZero = (time) => {
    if (time < 10) {
        time = '0' + time;
    }
    return time;
}

const millisecondsToFormattedTime = (milliseconds) => {
    let seconds = Math.floor(milliseconds / 1000);
    // milliseconds = milliseconds % 1000;
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return addLeadingZero(minutes) + ':' + addLeadingZero(seconds);
}

const resetPlayback = (handleUpdateTimeElapsed, handleTogglePause) => {
    handleUpdateTimeElapsed(0);
    handleTogglePause();
}

const updatePlayback = (trackDuration_ms, timeElapsed_ms, handleUpdateTimeElapsed, handleUpdateTimer, handleTogglePause) => {
    if(trackDuration_ms - timeElapsed_ms >= 10) {
        handleUpdateTimer(setTimeout(() => {
            handleUpdateTimeElapsed(timeElapsed_ms + 10);
        }, 10)); // odstępy niższe niż 10 mogą nie działać poprawnie ze względu na ograniczenia przeglądarki
    }
    else {
        resetPlayback(handleUpdateTimeElapsed, handleTogglePause)
    }
}

const togglePlayback = (paused, trackDuration_ms, getTimeElapsed_ms, handleUpdateTimeElapsed, handleUpdateTimer, handleTogglePause) => {
    if(paused) {
        handleUpdateTimer(-1);
    }
    else {
        updatePlayback(trackDuration_ms, getTimeElapsed_ms, handleUpdateTimeElapsed, handleUpdateTimer, handleTogglePause);
    }
}

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
                <img src = '../resources/btn_prevTrack.svg' alt = 'Previous track' />
                <img src = {'../resources/btn_' + (paused ? 'play' : 'pause') + '.svg'} alt = {paused ? 'Play' : 'Pause'} onClick = {handleTogglePause} />
                <img src = '../resources/btn_nextTrack.svg' alt = 'Next track' />
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