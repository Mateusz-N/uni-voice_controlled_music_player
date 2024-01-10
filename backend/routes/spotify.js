// #region Import bibliotek
const express = require('express')
const queryString = require('node:querystring');
const axios = require('axios');
const router = express.Router();
const crypto = require('crypto');
const SpotifyModel = require('../models/spotify');
const SpotifyService = require('../services/spotify');
// #endregion

// #region Zmienne konfiguracyjne
const SERVER_PORT_HTTPS = process.env.SERVER_PORT_HTTPS || 3060;
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
const SERVER_URL_HTTPS = process.env.SERVER_URL_HTTPS || `https://localhost:${SERVER_PORT_HTTPS}`;
const CLIENT_URL_HTTPS = process.env.CLIENT_URL_HTTPS || `https://localhost:${CLIENT_PORT}`;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const RESPONSE_TYPE = 'code';
const REDIRECT_URI = `${SERVER_URL_HTTPS}/spotify/auth`;
const SCOPE = 'playlist-read-private playlist-read-collaborative user-library-read';
const STATE = crypto.randomBytes(10).toString('hex');
const AUTH_URL = new URL('https://accounts.spotify.com/authorize');
const CODE_VERIFIER = crypto.randomBytes(32).toString('hex');
const CODE_CHALLENGE = crypto
  .createHash('sha256')
  .update(CODE_VERIFIER)
  .digest('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '')
// #endregion

// #region Funkcje pomocnicze
const requestAccessToken = async (res, grantType, queryParams) => {
  const queryObject = {
    grant_type: grantType,
    client_id: queryParams.clientId
  }
  if(grantType === 'authorization_code') {
    queryObject.code = queryParams.code;
    queryObject.redirect_uri = queryParams.redirectUri;
    queryObject.code_verifier = queryParams.codeVerifier
  }
  else if(grantType === 'refresh_token') {
    queryObject.refresh_token = queryParams.refreshToken
  }
  const res_token = await axios.post(
    'https://accounts.spotify.com/api/token',
    queryString.stringify(queryObject),
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
      }
    }
  );
  if(res_token.status === 200) {
    res.cookie('accessToken', res_token.data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });
    res.cookie('accessToken_expirationDateInSeconds', new Date().getSeconds() + res_token.data.expires_in, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    })
    res.cookie('refreshToken', res_token.data.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });
    SpotifyModel.registerUserConnection(res_token.data.access_token, res_token.data.refresh_token);
    return res_token.data.access_token;
  }
  else {
    res.status(res_token.status).send({
      error: 'Something went wrong!'
    });
  }
}

const verifyAccessToken = async (res, accessToken, accessToken_expirationDateInSeconds, refreshToken, clientId) => {
  if(new Date().getSeconds() < accessToken_expirationDateInSeconds) {
    return accessToken;
  }
  const newToken = await requestAccessToken(res, 'refresh_token', {
    clientId: clientId,
    refreshToken: refreshToken
  });
  return newToken;
}

const retrieveAccessToken = (req) => {
  const accessToken = req.cookies.accessToken;
  const accessToken_expirationDateInSeconds = req.cookies.accessToken_expirationDateInSeconds;
  const refreshToken = req.cookies.refreshToken;
  return [accessToken, accessToken_expirationDateInSeconds, refreshToken];
}

const handleGetItemsRequest = async (accessToken, initialEndpoint, onSuccess) => {
/*Obsługa wszelkiego rodzaju żądań,
  które pobierają dane z wykorzystaniem paginacji*/
  let nextEndpoint = initialEndpoint;
  let items = null;
  do {
    const res_items = await axios.get(
      nextEndpoint,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      }
    );
    if(res_items.status === 200) {
      [items, nextEndpoint] = onSuccess(items, res_items, nextEndpoint);
    }
    else {
      res.status(res_items.status).send({
        error: 'Something went wrong!'
      });
    }
  }
  while(nextEndpoint);
  return items;
}

const getPropertyByString = (object, string) => {
  const properties = string.split('.');
  while(properties.length > 0) {
    object = object[properties.shift()];
  }
  return object;
}

const handleGetSingleItemRequest = async (accessToken, initialEndpoint, nextEndpointReference, responseBodyItemsReference) => {
  const onSuccess = (item, res_item, nextEndpoint) => {
    const itemPage = res_item.data;
    if(!item) {
      item = itemPage;
      nextEndpoint = getPropertyByString(itemPage, nextEndpointReference);
    }
    else {
      getPropertyByString(item, responseBodyItemsReference).push(...itemPage.items);
      nextEndpoint = itemPage.next;
    }
    return [item, nextEndpoint]
  }
  return await handleGetItemsRequest(accessToken, initialEndpoint, onSuccess);
}

const handleGetMultipleItemsRequest = async (accessToken, initialEndpoint, responseBodyItemsReference) => {
  const onSuccess = (items, res_items, nextEndpoint) => {
    const itemsPage = getPropertyByString(res_items.data, responseBodyItemsReference).map(item => {
      return {
        id: item.id,
        type: item.type,
        name: item.name,
        thumbnailSrc: item.images ? (item.images[0] ? item.images[0].url : null) : null
      }
    });
    if(!items) {
      items = itemsPage;
    }
    else {
      items.push(...itemsPage);
    }
    nextEndpoint = res_items.data.next;
    return [items, nextEndpoint]
  }
  return await handleGetItemsRequest(accessToken, initialEndpoint, onSuccess);
}
// #endregion

// #region Punkty końcowe
/* Generowanie linku do autoryzacji użytkownika w serwisie Spotify */
router.get('/auth-url', async (req, res) => {    
  const AUTH_URL_PARAMS = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: RESPONSE_TYPE,
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    state: STATE,
    code_challenge_method: 'S256',
    code_challenge: CODE_CHALLENGE,
    show_dialog: true
  });
  AUTH_URL.search = AUTH_URL_PARAMS.toString();
  res.status(200).send({authURL: AUTH_URL});
});

/* Pozyskanie i przekazanie klientowi tokenu dostępu na podstawie kodu dostarczonego przez serwis Spotify po pomyślnej autoryzacji */
router.get('/auth', async (req, res) => {
  const returnedCode = req.query.code || null;
  const returnedState = req.query.state || null;

  /* Autoryzacja powiodła się? */
  if(returnedState !== STATE) {
    res.redirect(`${CLIENT_URL_HTTPS}?error=state_mismatch`);
  }
  else {
    await requestAccessToken(res, 'authorization_code', {
      clientId: CLIENT_ID,
      code: returnedCode,
      redirectUri: REDIRECT_URI,
      codeVerifier: CODE_VERIFIER
    });
    const closePopupScript = `
      <script>
        window.close();
      </script>
    `
    res.status(200).send(closePopupScript);
  }
});

router.post('/logout', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  if(!accessToken) {
    res.status(401).send({
      error: 'Invalid access token!'
    });
    return;
  }
  SpotifyModel.unregisterUserConnection(accessToken);
  res.clearCookie('accessToken');
  res.clearCookie('accessToken_expirationDateInSeconds');
  res.clearCookie('refreshToken');
  res.clearCookie('userID');
  res.clearCookie('userName');
  res.status(200).send({
    message: 'Logged out successfully!'
  });
});

/* Pobranie informacji o profilu w serwisie Spotify zalogowanego użytkownika */
router.get('/user', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  if(!accessToken) {
    res.status(401).send({
      error: 'Invalid access token!'
    });
    return;
  }
  const requestDestination = req.get('destination') || 'db';
  const handleResponse = (res_profile) => {
    if(res_profile.status === 200) {
      const profile = {
        userID: res_profile.data.id,
        userName: res_profile.data.display_name,
        profilePicURL: res_profile.data.images[0] ? res_profile.data.images[0].url : null,
        message: 'Logged in successfully!'
      }
      SpotifyModel.addUserProfile(accessToken, profile.userID, profile.userName, profile.profilePicURL);
      res.cookie('userID', profile.userID);
      res.cookie('userName', profile.userName);
      res.status(200).send(profile);
    }
    else {
      res.status(res_profile.status).send({
        error: 'Something went wrong!'
      });
    }
  }
  if(requestDestination === 'db') {
    SpotifyModel.getUserProfile(accessToken, (results) => {
      // Jeśli w bazie znaleziono profil, należy go zwrócić...
      if(results.length > 0) {
        res.status(200).send(results);
        return;
      }
      // ...W przyciwnym razie, należy pobrać go z API
      SpotifyService.getUserProfile(accessToken, handleResponse);
    });
  }
  else if(requestDestination === 'api') {
    SpotifyService.getUserProfile(accessToken, handleResponse);
  }
});

/* Pobranie list odtwarzania w serwisie Spotify zalogowanego użytkownika */
router.get('/playlists', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const requestDestination = req.get('destination') || 'db';
  const handleGetPlaylistsApiResponse = (playlists) => {
    SpotifyModel.addUserPlaylists(req.cookies.userID, playlists);
    res.status(200).send(playlists);
  }
  if(requestDestination === 'db') {
    SpotifyModel.getUserPlaylists(req.cookies.userID, (results) => {
      if(results.length > 0) {
        const playlists = results.map(playlist => {
          playlist.type = 'playlist';
          playlist.thumbnailSrc = playlist.thumbnail;
          playlist.owner = req.cookies.userName;
          delete playlist.thumbnail;
          return playlist;
        });
        res.status(200).send(playlists);
        return;
      }
      SpotifyService.getPlaylists(accessToken, handleGetPlaylistsApiResponse);
    });
  }
  else if(requestDestination === 'api') {
    SpotifyService.getPlaylists(accessToken, handleGetPlaylistsApiResponse);
  }
});

/* Pobranie albumów konkretnego wykonawcy */
router.get('/artist/:id/albums', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const artistID = req.params.id;
  const requestDestination = req.get('destination') || 'db';
  let albums;
  if(requestDestination === 'api') {
    let initialEndpoint = `https://api.spotify.com/v1/artists/${artistID}/albums`;
    albums = await handleGetMultipleItemsRequest(accessToken, initialEndpoint, 'items');
  }
  else if(requestDestination === 'db') {
    // db handler
  }
  res.status(200).send(albums);
})

/* Pobranie konkretnej listy odtwarzania */
router.get('/playlist/:id', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const playlistID = req.params.id;
  const requestDestination = req.get('destination') || 'db';
  let playlist;
  if(requestDestination === 'api') {
    let initialEndpoint = `https://api.spotify.com/v1/playlists/${playlistID}`;
    let nextEndpointReference = 'tracks.next';
    let itemsReference = 'tracks.items';
    if(playlistID === '1') { // Polubione utwory
      initialEndpoint = 'https://api.spotify.com/v1/me/tracks?limit=50';
      nextEndpointReference = 'next';
      itemsReference = 'items';
    }
    playlist = await handleGetSingleItemRequest(accessToken, initialEndpoint, nextEndpointReference, itemsReference);
  }
  else if(requestDestination === 'db') {
    // db handler
  }
  res.status(200).send(playlist);
});

/* Pobranie konkretnego albumu */
router.get('/album/:id', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const albumID = req.params.id;
  const requestDestination = req.get('destination') || 'db';
  let album;
  if(requestDestination === 'api') {
    const initialEndpoint = `https://api.spotify.com/v1/albums/${albumID}`;
    const nextEndpointReference = 'tracks.next';
    const itemsReference = 'tracks.items';
    album = await handleGetSingleItemRequest(accessToken, initialEndpoint, nextEndpointReference, itemsReference);
  }
  else if(requestDestination === 'db') {
    // db handler
  }
  res.status(200).send(album);
});

/* Pobranie konkretnego wykonawcy */
router.get('/artist/:id', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const artistID = req.params.id;
  const requestDestination = req.get('destination') || 'db';
  let artist;
  if(requestDestination === 'api') {
    const res_artist = await axios.get(
      `https://api.spotify.com/v1/artists/${artistID}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    if(res_artist.status === 200) {
      artist = res_artist.data;
    }
  }
  else if(requestDestination === 'db') {
    // db handler
  }
  res.status(200).send(artist);
});

/* Przeszukiwanie katalogu Spotify */
router.get('/search', async (req, res) => {
  res.cookie('accessToken_expirationDateInSeconds', new Date().getSeconds());
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const query = req.query.query;
  const results = {};
  for (const type of ['album', 'artist', 'playlist', 'track']) {
    const initialEndpoint = `https://api.spotify.com/v1/search?q=${query}&type=${type}&limit=50`;
    results[type] = await handleGetMultipleItemsRequest(accessToken, initialEndpoint, `${type}s.items`);
  }
  res.status(200).send(results);
})
// #endregion

module.exports = router;