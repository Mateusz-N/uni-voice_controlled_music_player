// #region Importy bibliotek
const express = require('express')
const router = express.Router();
const DiscogsService = require('../services/discogs');
// #endregion

// #region Punkty końcowe
/* Pobranie danych o utworze */
router.get('/track', async (req, res) => {
    const trackName = req.query.title;
    const artistName = req.query.artist;
    const releaseYear = req.query.year;
    DiscogsService.searchTrack(trackName, artistName, releaseYear, (res_results) => {
      if(res_results.status === 200) {
        const trackID = res_results.data.results[0].id;
        DiscogsService.getRelease(trackID, (res_track) => {
          if(res_track.status === 200) {
            const track = res_track.data;
            res.status(200).send(track);
          }
          else {
            res.status(res_results.status).send({
              error: 'Something went wrong!'
            });
          }
        });
      }
    });
  });
// #endregion

module.exports = router;