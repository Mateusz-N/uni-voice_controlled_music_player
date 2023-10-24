export const addLeadingZero = (time) => {
    if (time < 10) {
        time = '0' + time;
    }
    return time;
}

export const millisecondsToFormattedTime = (milliseconds) => {
    let seconds = Math.floor(milliseconds / 1000);
    // milliseconds = milliseconds % 1000;
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return addLeadingZero(minutes) + ':' + addLeadingZero(seconds);
}

export const resetPlayback = (handleUpdateTimeElapsed, handleTogglePause) => {
    handleUpdateTimeElapsed(0);
    handleTogglePause();
}

export const updatePlayback = (trackDuration_ms, timeElapsed_ms, handleUpdateTimeElapsed, handleUpdateTimer, handleTogglePause) => {
    if(trackDuration_ms - timeElapsed_ms >= 10) {
        handleUpdateTimer(setTimeout(() => {
            handleUpdateTimeElapsed(timeElapsed_ms + 10);
        }, 10)); // odstępy niższe niż 10 mogą nie działać poprawnie ze względu na ograniczenia przeglądarki
    }
    else {
        resetPlayback(handleUpdateTimeElapsed, handleTogglePause)
    }
}

export const togglePlayback = (paused, trackDuration_ms, getTimeElapsed_ms, handleUpdateTimeElapsed, handleUpdateTimer, handleTogglePause) => {
    if(paused) {
        handleUpdateTimer(-1);
    }
    else {
        updatePlayback(trackDuration_ms, getTimeElapsed_ms, handleUpdateTimeElapsed, handleUpdateTimer, handleTogglePause);
    }
}