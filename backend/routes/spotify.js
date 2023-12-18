// #region Import bibliotek
const express = require('express')
const queryString = require('node:querystring');
const axios = require('axios');
const router = express.Router();
const crypto = require('crypto');
// #endregion

// #region Zmiene konfiguracyjne
const { CLIENT_PORT, SERVER_PORT } = require('../config');
const CLIENT_ID = '***REMOVED***';
const CLIENT_SECRET = '***REMOVED***';
const RESPONSE_TYPE = 'code';
const REDIRECT_URI = `http://localhost:${SERVER_PORT}/spotify/auth`;
const SCOPE = 'playlist-read-private playlist-read-collaborative user-library-read';
const STATE = crypto.randomBytes(10).toString('hex');
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPE}&state=${STATE}&show_dialog=true`;
// #endregion

// #region Punkty końcowe
/* Generowanie linku do autoryzacji użytkownika w serwisie Spotify */
router.get('/auth-url', (req, res) => {
  res.status(200).send({authURL: AUTH_URL});
});

/* Pozyskanie i przekazanie klientowi tokenu dostępu na podstawie kodu dostarczonego przez serwis Spotify po pomyślnej autoryzacji */
router.get('/auth', async (req, res) => {
  const returnedCode = req.query.code || null;
  const returnedState = req.query.state || null;

  /* Autoryzacja powiodła się? */
  if(returnedState !== STATE) {
    res.redirect(`http://localhost:${CLIENT_PORT}?error=state_mismatch`);
  }
  else {
    const res_token = await axios.post(
      'https://accounts.spotify.com/api/token',
      queryString.stringify({
        code: returnedCode,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      }),
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
        }
      }
    );
    res.status(302).redirect(`http://localhost:${CLIENT_PORT}?accessToken=${res_token.data.access_token}`);
  }
});

/* Pobranie informacji o profilu w serwisie Spotify zalogowanego użytkownika */
router.get('/user', async (req, res) => {
  const accessToken = req.headers.authorization.split(' ')[1];
  const res_profile = await axios.get(
    'https://api.spotify.com/v1/me',
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  if(res_profile.status === 200) {
    res.status(200).send({
      userID: res_profile.data.id,
      userName: res_profile.data.display_name,
      profilePicURL: res_profile.data.images[0].url
    });
  }
  else {
    res.status(res_profile.status).send({
      error: 'Something went wrong!'
    });
  }
});

/* Pobranie list odtwarzania w serwisie Spotify zalogowanego użytkownika */
router.get('/playlists', async (req, res) => {
  const accessToken = req.cookies.accessToken;
  let playlists;
  let nextEndpoint = `https://api.spotify.com/v1/me/playlists?limit=50`;
  do {
    const res_playlists = await axios.get(
      nextEndpoint,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      }
    );
    if(res_playlists.status === 200) {
      const playlistsPage = res_playlists.data.items.map(playlist => ({
          id: playlist.id,
          type: 'playlist',
          name: playlist.name,
          thumbnailSrc: playlist.images[0].url,
          description: playlist.description
      }));
      if(!playlists) {
        playlists = playlistsPage;
      }
      else {
        playlists.push(...playlistsPage);
      }
      nextEndpoint = res_playlists.data.next
    }
    else {
      res.status(res_profile.status).send({
        error: 'Something went wrong!'
      });
    }
  }
  while(nextEndpoint);
  res.status(200).send(playlists);
});

/* Pobranie konkretnej listy odtwarzania */
router.get('/playlist/:id', async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const playlistID = req.params.id;
  let playlist, nextEndpoint;
  if(playlistID === '1') { // Polubione utwory
    nextEndpoint = 'https://api.spotify.com/v1/me/tracks?limit=50';
  }
  else {
    nextEndpoint = `https://api.spotify.com/v1/playlists/${playlistID}`;
  }
  do {
    const res_playlist = await axios.get(
      nextEndpoint,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    if(res_playlist.status === 200) {
      const playlistPage = res_playlist.data;
      if(!playlist) {
        playlist = playlistPage;
        nextEndpoint = playlistID === '1' ? playlistPage.next : playlistPage.tracks.next;
      }
      else {
        playlistID === '1' ? playlist.items.push(...playlistPage.items) : playlist.tracks.items.push(...playlistPage.items);
        nextEndpoint = playlistPage.next;
      }
    }
    else {
      res.status(res_profile.status).send({
        error: 'Something went wrong!'
      });
    }
  }
  while(nextEndpoint);
  res.status(200).send(playlist);
});

/* Pobranie konkretnego wykonawcy */
router.get('/artist/:id', async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const artistID = req.params.id;
  const res_artist = await axios.get(
    `https://api.spotify.com/v1/artists/${artistID}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  if(res_artist.status === 200) {
    const artist = res_artist.data;
    res.status(200).send(artist);
  }
});
// #endregion

module.exports = router;