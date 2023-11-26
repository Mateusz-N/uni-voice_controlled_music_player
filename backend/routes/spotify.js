const express = require('express')
const queryString = require('node:querystring');
const axios = require('axios');
const router = express.Router();
const crypto = require('crypto');

const { CLIENT_PORT, SERVER_PORT } = require('../config');
const CLIENT_ID = '***REMOVED***';
const CLIENT_SECRET = '***REMOVED***';
const RESPONSE_TYPE = 'code';
const REDIRECT_URI = `http://localhost:${SERVER_PORT}/spotify/auth`;
const SCOPE = 'playlist-read-private playlist-read-collaborative';
const STATE = crypto.randomBytes(10).toString('hex');
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPE}&state=${STATE}&show_dialog=true`;

router.get('/auth-url', (req, res) => {
  res.status(200).send({authURL: AUTH_URL});
});

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

router.get('/playlists', async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const userID = req.cookies.userID;
  const res_playlists = await axios.get(
    `https://api.spotify.com/v1/users/${userID}/playlists`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if(res_playlists.status === 200) {
    console.log(res_playlists.data.items)
    const playlists = res_playlists.data.items.map(playlist => {
      return {
        id: playlist.id,
        name: playlist.name,
        thumbnailSrc: playlist.images[0].url,
        description: playlist.description
      }
    });
    console.log(playlists)
    res.status(200).send(playlists);
  }
});

module.exports = router;