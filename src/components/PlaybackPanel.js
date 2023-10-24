import { useEffect, useState } from 'react';

import { millisecondsToFormattedTime, updatePlayback, togglePlayback } from '../common/auxiliaryFunctions';
import Styles from './PlaybackPanel.module.scss'

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