// #region Import bibliotek
const express = require('express');
const router = express.Router();
const MusixmatchService = require('../services/musixmatch');
// #endregion

const API_KEY = process.env.MUSIXMATCH_API_KEY;

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
    MusixmatchService.getSynchronousLyrics(trackTitle, artistName, albumName, trackDuration, handleGetSynchronousLyricsApiResponse);
});
/* Pobranie statycznego tekstu piosenki (opcja awaryjna) */
router.get('/lyrics/', async (req, res) => {
    const trackTitle = req.query.track;
    const artistName = req.query.artist;
    const handleGetLyricsApiResponse = (res_lyrics) => {
      if(res_lyrics.data.message.header.status_code === 200) {
        const lyrics = res_lyrics.data.message.body.lyrics;
        res.status(200).send(lyrics);
      }
      else {
        res.status(res_lyrics.data.message.header.status_code).send({
          error: 'Something went wrong!'
        });
      }
    }
    MusixmatchService.getLyrics(API_KEY, trackTitle, artistName, handleGetLyricsApiResponse);
});
// #endregion

module.exports = router;