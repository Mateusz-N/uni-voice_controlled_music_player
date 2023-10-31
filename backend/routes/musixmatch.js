const express = require('express')
const queryString = require('node:querystring');
const axios = require('axios');
const router = express.Router();

const API_KEY = '***REMOVED***';

router.get('/', async (req, res) => {
    const trackName = 'Rapper\'s Delight';
    const artistName = 'The Sugarhill Gang';
    const response = await axios.get('https://api.musixmatch.com/ws/1.1/matcher.lyrics.get', {
      params: {
        q_track: trackName,
        q_artist: artistName,
        apikey: API_KEY,
      },
    });

    const lyrics = response.data.message.body.lyrics.lyrics_body;
    res.send(`<p>Tekst utworu <strong>${trackName}</strong>: <blockquote><em style="white-space: pre-line">${lyrics}</em></blockquote></p>`);
});

module.exports = router;