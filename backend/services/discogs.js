const axios = require('axios');

module.exports = {
    searchTrack: async (trackName, artistName, releaseYear, callback) => {
        // Rok wydania zamiast nazwy albumu, ze względu na ewentualne specjalne wydania albumu
        // Np. 'Abbey Road — 20th Anniversary Remaster' -- wysoce prawdopodobne, że wyszukanie dokładnie tej frazy nie zwróci żadnych wyników)
        axios.get(
            `https://api.discogs.com/database/search?track=${trackName}&artist=${artistName}&year=${releaseYear}&type=release&per_page=2&page=1`,
            {
                headers: {
                    'Authorization': `Discogs token=${process.env.DISCOGS_ACCESS_TOKEN}`
                }  
            })
                .then((res_results) => {
                    callback(res_results);
                    console.log('API: Search executed!');
                })
                .catch(console.error);
    },
        getRelease: async (releaseID, callback) => {
            axios.get(`https://api.discogs.com/releases/${releaseID}`)
                .then((res_track) => {
                    callback(res_track);
                    console.log('API: Release retrieved!');
                })
                .catch(console.error);
    }
}