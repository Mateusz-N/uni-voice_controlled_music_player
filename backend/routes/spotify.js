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
const SCOPE = 'streaming playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative user-library-read user-library-modify user-read-playback-state user-modify-playback-state';
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
    res.cookie('accessToken_expirationDateInSeconds', new Date().getTime() / 1000 + res_token.data.expires_in, {
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
  if(!accessToken) {
    return accessToken;
  }
  if(Math.floor(new Date().getTime() / 1000) < accessToken_expirationDateInSeconds) {
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

const handleToggleTrackSaved = async (req, res, accessToken, method) => {
  const IDs = req.query.ids;
  const handleToggleTrackSavedApiResponse = (res_toggleTrackSaved) => {
    if(res_toggleTrackSaved.status === 200) {
      res.status(200).send({
        message: {
          message: `Track ${method === 'PUT' ? 'added to' : 'removed from'} favorites successfully!`,
          type: 'success'
        }
      });
    }
    else {
      res.status(res_toggleTrackSaved.status).send({
        error: 'Something went wrong!'
      });
    }
  }
  SpotifyService.toggleTrackSaved(accessToken, method, IDs, handleToggleTrackSavedApiResponse)
}

const handleTrackInPlaylist = async (req, res, accessToken, method) => {
  const playlistID = req.params.id;
  const trackURIs = req.body.uris;
  const handleTrackInPlaylistApiResponse = (res_playlist) => {
    if([200, 201].includes(res_playlist.status)) {
      res.status(res_playlist.status).send({
        message: {
          message: `Track(s) ${method === 'POST' ? 'added' : 'removed'} successfully!`,
          type: 'success'
        }
      });
    }
    else {
      res.status(res_playlist.status).send({
        error: 'Something went wrong!'
      });
    }
  }
  SpotifyService.trackInPlaylist(accessToken, playlistID, trackURIs, method, handleTrackInPlaylistApiResponse);
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
    message: {
      message: 'Logged out successfully!',
      type: 'success'
    }
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
        message: {
          message: 'Logged in successfully!',
          type: 'success'
        }
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
          playlist.owner = {id: req.cookies.userID, name: req.cookies.userName};
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
  const handleGetArtistAlbumsApiResponse = (albums) => {
    res.status(200).send(albums);
  }
  SpotifyService.getArtistAlbums(accessToken, artistID, handleGetArtistAlbumsApiResponse);
});

/* Pobranie konkretnej listy odtwarzania */
router.get('/playlist/:id', async (req, res) => {
/*UWAGA: Właściwości listy odtwarzania mogą być nieaktualne, jeśli niedawno miała miejsce aktualizacja.
  Jest to prawdopodobnie defekt w punkcie końcowym 'Get Playlist' Spotify API.
  Np. punkt końcowy 'Get User's Playlists' wyświetla aktualną nazwę listy, a 'Get Playlist' nie. */
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const playlistID = req.params.id;
  const requestDestination = req.get('destination') || 'db';
  const handleGetPlaylistApiResponse = (playlist) => {
    res.status(200).send(playlist);
  }
  if(requestDestination === 'db') {
    SpotifyModel.getPlaylist(playlistID, (result) => {
      if(result) {
        res.status(200).send(result);
        return;
      }
      SpotifyService.getPlaylist(accessToken, handleGetPlaylistApiResponse);
    });
  }
  else if(requestDestination === 'api') {
    SpotifyService.getPlaylist(accessToken, playlistID, handleGetPlaylistApiResponse);
  }
});

/* Pobranie konkretnego albumu */
router.get('/album/:id', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const albumID = req.params.id;
  const handleGetAlbumApiResponse = (album) => {
    res.status(200).send(album);
  }
  SpotifyService.getAlbum(accessToken, albumID, handleGetAlbumApiResponse);
});

/* Pobranie konkretnego wykonawcy */
router.get('/artist/:id', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const artistID = req.params.id;
  const handleGetArtistApiResponse = (res_artist) => {
    if(res_artist.status === 200) {
      res.status(200).send(res_artist.data);
    }
  }
  SpotifyService.getArtist(accessToken, artistID, handleGetArtistApiResponse);
});

/* Przeszukanie katalogu Spotify */
router.get('/search', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const query = req.query.query;
  let types;
  if(req.query.types) {
    types = req.query.types.split(',');
  }
  else {
    types = ['album', 'artist', 'playlist', 'track'];
  }
  const handleSearchAllApiResponse = (results) => {
    res.status(200).send(results);
  }
  SpotifyService.search(accessToken, query, types, handleSearchAllApiResponse);
})

/* Dodanie listy odtwarzania */
router.post('/:userID/playlist', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const userID = req.params.userID;
  const playlistName = req.body.name || 'Unknown playlist';
  const isPlaylistPublic = req.body.public || true;
  const isPlaylistCollaborative = req.body.collaborative || false;
  const playlistDescription = req.body.description || '';
  const playlistProperties = {
    name: playlistName,
    description: playlistDescription,
    public: isPlaylistPublic,
    collaborative: isPlaylistCollaborative
  }
  const handleCreatePlaylistApiResponse = (res_playlist) => {
    if(res_playlist.status === 201) {
      res.status(201).send({
        playlistID: res_playlist.data.id,
        message: {
          message: 'Playlist created successfully!',
          type: 'success'
        }
      });
    }
    else {
      res.status(res_playlist.status).send({
        error: 'Something went wrong!'
      });
    }
  }
  SpotifyService.createPlaylist(accessToken, userID, playlistProperties, handleCreatePlaylistApiResponse);
});

/* Usunięcie (w rzeczywistości zaprzestanie śledzenia) listy odtwarzania */
router.delete('/playlist/:id', async(req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const playlistID = req.params.id;
  const handleDeletePlaylistApiResponse = (res_playlist) => {
    if(res_playlist.status === 200) {
      res.status(200).send({
        message: {
          message: 'Playlist deleted successfully!',
          type: 'success'
        }
      });
    }
    else {
      res.status(res_playlist.status).send({
        error: 'Something went wrong!'
      });
    }
  }
  SpotifyService.deletePlaylist(accessToken, playlistID, handleDeletePlaylistApiResponse);
});

/* Aktualizacja metadanych listy odtwarzania */
router.put('/playlist/:id', async (req, res) => {
/*UWAGA: punktu końcowy 'Get Playlist' będzie przez pewien czas zwracać nieaktualne dane.
  Jest to prawdopodobnie defekt w owym punkcie końcowym.
  Ponadto, właściwość 'public' zdaje się w ogóle nie być aktualizowana przez Spotify... */
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const playlistID = req.params.id;
  const updatedDetailName = req.body.detailName;
  const updatedDetailValue = req.body.detailValue;
  const handleUpdatePlaylistApiResponse = (res_playlist) => {
    if(res_playlist.status === 200) {
      res.status(200).send({
        message: {
          message: 'Playlist updated successfully!',
          type: 'success'
        }
      });
    }
    else {
      res.status(res_playlist.status).send({
        error: 'Something went wrong!'
      });
    }
  }
  if(updatedDetailName == null || updatedDetailValue == null) {
    res.status(422).send({
      message: {
        message: 'Missing request data!',
        type: 'error'
      }
    });
    return;
  }
  SpotifyService.updatePlaylist(accessToken, playlistID, updatedDetailName, updatedDetailValue, handleUpdatePlaylistApiResponse);
});

/* Sprawdzenie, które z podanych utworów zostały polubione przez użytkownika */
router.get('/tracks/saved/check', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const IDs = req.query.ids;
  const handleCheckTracksSavedApiResponse = (res_check) => {
    if(res_check.status === 200) {
      const results = res_check.data;
      res.status(200).send(results);
    }
    else {
      res.status(res_check.status).send({
        error: 'Something went wrong!'
      });
    }
  }
  SpotifyService.checkTracksSaved(accessToken, IDs, handleCheckTracksSavedApiResponse);
});

/* Dodanie utworu do polubionych */
router.put('/tracks/saved', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  handleToggleTrackSaved(req, res, accessToken, 'PUT');
});

/* Usunięcie utworu z polubionych */
router.delete('/tracks/saved', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  handleToggleTrackSaved(req, res, accessToken, 'DELETE');
});

/* Dodanie utworów do listy odtwarzania */
router.post('/playlist/:id/tracks', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  handleTrackInPlaylist(req, res, accessToken, 'POST');
});
// #endregion

/* Usunięcie utworów z listy odtwarzania */
router.delete('/playlist/:id/tracks', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  handleTrackInPlaylist(req, res, accessToken, 'DELETE');
});

/* Pobranie dostępnych gatunków */
router.get('/genres', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const handleGetGenresApiResponse = (res_genres) => {
    if(res_genres.status === 200) {
      const genres = res_genres.data.genres;
      res.status(200).send(genres);
    }
    else {
      res.status(res_genres.status).send({
        error: 'Something went wrong!'
      });
    }
  }
  SpotifyService.getGenres(accessToken, handleGetGenresApiResponse);
});

/* Pobranie rekomendacji */
router.get('/recommendations', async (req, res) => {
  const accessToken = await verifyAccessToken(res, ...retrieveAccessToken(req), CLIENT_ID);
  const queryObject = req.query;
  if(queryObject.limit == null ) {
    queryObject.limit = 100;
  }
  const handleGetRecommendationsApiResponse = (res_recommendations) => {
    if(res_recommendations.status === 200) {
      const recommendations = res_recommendations.data;
      res.status(200).send(recommendations);
    }
    else {
      res.status(res_recommendations.status).send({
        error: 'Something went wrong!'
      });
    }
  }
  SpotifyService.getRecommendations(accessToken, queryObject, handleGetRecommendationsApiResponse);
});

// #endregion

module.exports = router;