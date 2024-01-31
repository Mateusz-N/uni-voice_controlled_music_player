// #region Import bibliotek
const express = require('express');
const router = express.Router();
const LrclibService = require('../services/lrclib');
// #endregion

// #region Punkty końcowe
/* Pobranie synchronicznego tekstu piosenki */
router.get('/lyrics/synchronous', async (req, res) => {
    const trackTitle = req.query.track;
    const artistName = req.query.artist;
    const albumName = req.query.album;
    const trackDuration = req.query.duration;
    const handleGetSynchronousLyricsApiResponse = (res_lyrics) => {
      if(res_lyrics.status === 200) {
        const lyrics = res_lyrics.data;
        res.status(200).send(lyrics);
      }
      else {
        res.status(res_lyrics.status).send({
          error: 'Something went wrong!'
        });
      }
    }
    LrclibService.getSynchronousLyrics(trackTitle, artistName, albumName, trackDuration, handleGetSynchronousLyricsApiResponse);
});
// #endregion

module.exports = router;