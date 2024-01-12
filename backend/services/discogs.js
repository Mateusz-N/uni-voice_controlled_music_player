const axios = require('axios');

module.exports = {
    search: async (queryParameters, type, callback) => {
        const queryParametersString = new URLSearchParams(queryParameters).toString();
        axios.get(
            `https://api.discogs.com/database/search?${queryParametersString}&type=${type}&per_page=2&page=1`,
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
    },
    getArtist: async (artistID, callback) => {
        axios.get(`https://api.discogs.com/artists/${artistID}`)
            .then((res_artist) => {
                callback(res_artist);
                console.log('API: Artist retrieved!');
            })
            .catch(console.error);
    }
}