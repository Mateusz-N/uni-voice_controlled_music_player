const axios = require('axios');

module.exports = {
    getLyrics: async (API_KEY, trackTitle, artistName, callback) => {
        axios.get('https://api.musixmatch.com/ws/1.1/matcher.lyrics.get', {
            params: {
                q_track: trackTitle,
                q_artist: artistName,
                apikey: API_KEY,
            },
        })
        .then((res_lyrics) => {
            callback(res_lyrics);
            console.log('API: Lyrics retrieved!');
        })
        .catch(console.error);
    },
    getSynchronousLyrics: async (trackTitle, artistName, albumName, trackDuration, callback) => {
        axios.get(`https://lrclib.net/api/get?artist_name=${artistName}&track_name=${trackTitle}&album_name=${albumName}&duration=${trackDuration}`)
        .then((res_lyrics) => {
            callback(res_lyrics);
            console.log('API: Synchronous lyrics retrieved!');
        })
        .catch(console.error);
    }
}