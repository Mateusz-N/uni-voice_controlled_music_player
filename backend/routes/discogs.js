// #region Importy bibliotek
const express = require('express')
const router = express.Router();
const DiscogsService = require('../services/discogs');
// #endregion

// #region Punkty końcowe
/* Pobranie danych o utworze */
router.get('/track', async (req, res) => {
  // Rok wydania zamiast nazwy albumu, ze względu na ewentualne specjalne wydania albumu
  // Np. 'Abbey Road — 20th Anniversary Remaster' -- wysoce prawdopodobne, że wyszukanie dokładnie tej frazy nie zwróci żadnych wyników)
  const trackName = req.query.title;
  const artistName = req.query.artist;
  const releaseYear = req.query.year;
  const queryParameters = {
    query: trackName,
    artist: artistName,
    year: releaseYear,
  }
  DiscogsService.search(queryParameters, 'release', (res_results) => {
    if(res_results.status === 200) {
      const trackID = res_results.data.results[0].id;
      DiscogsService.getRelease(trackID, (res_track) => {
        if(res_track.status === 200) {
          const track = res_track.data;
          res.status(200).send(track);
        }
        else {
          res.status(res_track.status).send({
            error: 'Something went wrong!'
          });
        }
      });
    }
    else {
      res.status(res_results.status).send({
        error: 'Something went wrong!'
      });
    }
  });
});

/* Pobranie danych o wykonawcy */
router.get('/artist/:name', async (req, res) => {
  const artistName = req.params.name;
  const queryParameters = {
    query: artistName
  }
  DiscogsService.search(queryParameters, 'artist', (res_results) => {
    if(res_results.status === 200) {
      console.log(res_results)
      const artistID = res_results.data.results[0].id;
      DiscogsService.getArtist(artistID, (res_artist) => {
        if(res_artist.status === 200) {
          const artist = res_artist.data;
          res.status(200).send(artist);
        }
        else {
          res.status(res_artist.status).send({
            error: 'Something went wrong!'
          });
        }
      });
    }
    else {
      res.status(res_results.status).send({
        error: 'Something went wrong!'
      });
    }
  });
});
// #endregion

module.exports = router;