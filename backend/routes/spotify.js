// #region Import bibliotek
const express = require('express')
const queryString = require('node:querystring');
const axios = require('axios');
const router = express.Router();
const crypto = require('crypto');
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

const handlePlaylistRequest = async (req, res, isAlbum) => {
/*Obsługa żądań dotyczących zarówno
  konkretnej listy odtwarzania jak i konkretnego albumu.
  Albumy to w końcu najzwyczajniej specjalne listy odtwarzania  */
  const accessToken = req.cookies.accessToken;
  const playlistID = req.params.id;
  let playlist, nextEndpoint;
  if(playlistID === '1') { // Polubione utwory
    nextEndpoint = 'https://api.spotify.com/v1/me/tracks?limit=50';
  }
  else {
    nextEndpoint = `https://api.spotify.com/v1/${isAlbum ? 'albums' : 'playlists'}/${playlistID}`;
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
}

const handlePlaylistsRequest = async (req, res, areArtistAlbums) => {
/*Obsługa żądań dotyczących zarówno list odtwarzania jak i albumów.
  Albumy to w końcu najzwyczajniej specjalne listy odtwarzania  */
  // const accessToken = req.cookies.accessToken;
  const accessToken = req.cookies.accessToken;
  let playlists, nextEndpoint;
  if(areArtistAlbums) {
    nextEndpoint = `https://api.spotify.com/v1/artists/${req.params.id}/albums`;
  }
  else {
    nextEndpoint = `https://api.spotify.com/v1/me/playlists?limit=50`;
  }
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
      const playlistsPage = res_playlists.data.items.map(playlist => {
        if(areArtistAlbums) {
          return {
            id: playlist.id,
            type: 'album',
            name: playlist.name,
            thumbnailSrc: playlist.images[0].url
          }
        }
        return {
          id: playlist.id,
          type: 'playlist',
          name: playlist.name,
          thumbnailSrc: playlist.images[0].url
        }
      });
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
}

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
    const res_token = await axios.post(
      'https://accounts.spotify.com/api/token',
      queryString.stringify({
        code: returnedCode,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        code_verifier: CODE_VERIFIER
      }),
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
        }
      }
    );
    res.cookie('accessToken', res_token.data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
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
  const accessToken = req.cookies.accessToken;
  if(!accessToken) {
    res.status(401).send({
      error: 'Invalid access token!'
    });
    return;
  }
  res.clearCookie('accessToken');
  res.status(200).send({
    message: "Logged out successfully!"
  });
});

/* Pobranie informacji o profilu w serwisie Spotify zalogowanego użytkownika */
router.get('/user', async (req, res) => {
  const accessToken = req.cookies.accessToken;
  if(!accessToken) {
    res.status(401).send({
      error: 'Invalid access token!'
    });
    return;
  }
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
  await handlePlaylistsRequest(req, res, false);
});

/* Pobranie konkretnej listy odtwarzania */
router.get('/playlist/:id', async (req, res) => {
  await handlePlaylistRequest(req, res, false);
});

/* Pobranie konkretnego albumu */
router.get('/album/:id', async (req, res) => {
  await handlePlaylistRequest(req, res, true);
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

/* Pobranie katalogu konkretnego wykonawcy */
router.get('/artist/:id/albums', async (req, res) => {
  await handlePlaylistsRequest(req, res, true);
})
// #endregion

module.exports = router;