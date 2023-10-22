import { useState } from 'react';

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

const PlaybackPanel = () => {
    const [paused, setPaused] = useState(true);
    const handleTogglePause = () => {
        setPaused(prevState => !prevState);
    }
    let timeElapsed_ms = 1500;
    let trackDuration_ms = 15000
    let timeElapsed_formatted = millisecondsToFormattedTime(timeElapsed_ms);
    let trackDuration_formatted = millisecondsToFormattedTime(trackDuration_ms);;
    
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
                    <div id = {Styles.progressBarFill} style = {{width: (timeElapsed_ms / trackDuration_ms * 100) + '%;'}}>

                    </div>
                </div>
                <p id = {Styles.trackDuration}>{trackDuration_formatted}</p>
            </div>
        </div>
    );
}

export default PlaybackPanel;