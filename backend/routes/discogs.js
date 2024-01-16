// #region Importy bibliotek
const express = require('express')
const router = express.Router();
const DiscogsService = require('../services/discogs');
// #endregion

// #region Funkcje pomocnicze
const handleSearchApiResponseGeneric = (res, res_results, nextRequest, nextRequestHandler) => {
  const handleNextRequest = (res_data) => {
    nextRequestHandler(res_data, res);
  }
  if(res_results.status === 200) {
    if(res_results.data.results.length < 1) {
      res.status(res_results.status).send({
        message: {
          message: `Requested item could not be found. Perhaps the archives are incomplete!`,
          type: 'warning'
        }
      });
      return;
    }
    const itemID = res_results.data.results[0].id;
    DiscogsService[nextRequest](itemID, handleNextRequest);
  }
  else {
    res.status(res_results.status).send({
      error: 'Something went wrong!'
    });
  }
}
const handleGetReleaseApiResponseGeneric = (res_release, res) => {
  if(res_release.status === 200) {
    const release = res_release.data;
    res.status(200).send(release);
  }
  else {
    res.status(res_release.status).send({
      error: 'Something went wrong!'
    });
  }
}
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
  const handleSearchApiResponse = (res_results) => {
    handleSearchApiResponseGeneric(res, res_results, 'getRelease', handleGetReleaseApiResponseGeneric);
  }
  DiscogsService.search(queryParameters, 'release', handleSearchApiResponse);
});

/* Pobranie danych o wykonawcy */
router.get('/artist/:name', async (req, res) => {
  const artistName = req.params.name;
  const queryParameters = {
    query: artistName
  }
  const handleGetArtistApiResponse = (res_artist) => {
    if(res_artist.status === 200) {
      const artist = res_artist.data;
      res.status(200).send(artist);
    }
    else {
      res.status(res_artist.status).send({
        error: 'Something went wrong!'
      });
    }
  }
  const handleSearchApiResponse = (res_results) => {
    handleSearchApiResponseGeneric(res, res_results, 'getArtist', handleGetArtistApiResponse);
  }
  DiscogsService.search(queryParameters, 'artist', handleSearchApiResponse);
});

/* Pobranie danych o albumie */
router.get('/album/:name', async (req, res) => {
  const albumName = req.params.name;
  const queryParameters = {
    query: albumName
  }
  const handleSearchApiResponse = (res_results) => {
    handleSearchApiResponseGeneric(res, res_results, 'getRelease', handleGetReleaseApiResponseGeneric);
  }
  DiscogsService.search(queryParameters, 'release', handleSearchApiResponse);
});
// #endregion

module.exports = router;