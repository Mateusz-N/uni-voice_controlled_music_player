// #region Import bibliotek
const express = require('express')
const queryString = require('node:querystring');
const axios = require('axios');
const router = express.Router();
// #endregion

const API_KEY = process.env.MUSIXMATCH_API_KEY;

// #region Punkty końcowe
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
// #endregion

module.exports = router;