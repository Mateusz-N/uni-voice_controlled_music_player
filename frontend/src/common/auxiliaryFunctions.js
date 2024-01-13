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

export const resetPlayback = (setCurrentTimestamp, handleTogglePause) => {
    setCurrentTimestamp(0);
    handleTogglePause();
}

export const updatePlayback = (trackDuration_ms, currentTimestamp_ms, setCurrentTimestamp, handleUpdateTimer, handleTogglePause) => {
    if(trackDuration_ms - currentTimestamp_ms >= 10) {
        handleUpdateTimer(setTimeout(() => {
            setCurrentTimestamp(currentTimestamp_ms + 10);
        }, 10)); // odstępy niższe niż 10 mogą nie działać poprawnie ze względu na ograniczenia przeglądarki
    }
    else {
        resetPlayback(setCurrentTimestamp, handleTogglePause)
    }
}

export const togglePlayback = (paused, trackDuration_ms, getCurrentTimestamp_ms, setCurrentTimestamp, handleUpdateTimer, handleTogglePause) => {
    if(paused) {
        handleUpdateTimer(-1);
    }
    else {
        updatePlayback(trackDuration_ms, getCurrentTimestamp_ms, setCurrentTimestamp, handleUpdateTimer, handleTogglePause);
    }
}

export const getPropertyByString = (object, path) => {
    // Pobiera właściwość obiektu określoną zapisem w notacji z kropką; wspiera indeksowanie tablic
    // Na przykład: getPropertyByString({a: {b: {c: [12, 13, 14]}}}, 'a.b.c[1]') ===> 13
    const properties = path.split('.');
    while(properties.length > 0) {
        const arrayProperty = properties[0].split('[')
        if(arrayProperty.length > 1) {
            const arrayPropertyName = arrayProperty[0];
            const arrayPropertyIndex = parseInt(arrayProperty[1].split(']')[0]);
            object = arrayPropertyName[arrayPropertyIndex];
            properties.shift();
        }
        else {
            object = object[properties.shift()];
        }
    }
    return object;
}

export const setPropertyByString = (object, path, value) => {
    // Zwraca kopię obiektu z ustawieniem zadanej właściwości, określonej zapisem w notacji z kropką; wspiera indeksowanie tablic
    // Na przykład: setPropertyByString({a: [{b: 'abc'}, {b: 'zxc'}]}, 'a[0].b', 'cba') ===> {a: [{b: 'cba'}, {b: 'zxc'}]}
    let [head, ...rest] = path.split('.');
    const clone = structuredClone(object);
    const arrayProperty = head.split('[');
    let arrayPropertyIndex;
    if(arrayProperty.length > 1) {
        head = arrayProperty[0];
        arrayPropertyIndex = parseInt(arrayProperty[1].split(']')[0]);
        clone[head][arrayPropertyIndex] = rest.length > 0 ? setPropertyByString(clone[head][arrayPropertyIndex], rest.join('.'), value) : value;
    }
    else {
        clone[head] = rest.length > 0 ? setPropertyByString(clone[head], rest.join('.'), value) : value;
    }
    return clone;
}

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const processUnorganizedItemDetails = (items, groupByKey, displayName, trackDetails) => { // Parsowanie danych Discogs API
    if(items && items.length > 0) {
        const uniqueGroups = [];
        items.forEach(item => {
            const alreadyPresentGroup = uniqueGroups.find(group => group[groupByKey] === item[groupByKey]);
            if(!alreadyPresentGroup) {
                uniqueGroups.push({
                    [groupByKey]: item[groupByKey], items: [item.name]
                });
                return;
            }
            alreadyPresentGroup.items.push(item.name);
        });
        const itemsList = uniqueGroups.map(group => ({
            displayName: group[groupByKey],
            value: group.items.join(', ')
        }));
        trackDetails.push({
            name: displayName,
            items: itemsList
        });
    }
};