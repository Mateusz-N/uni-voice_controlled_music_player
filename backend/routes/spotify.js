const express = require('express')
const queryString = require('node:querystring');
const axios = require('axios');
const router = express.Router();
const session = require('express-session')
const crypto = require('crypto');

const { CLIENT_PORT, SERVER_PORT } = require('../config');
const CLIENT_ID = '***REMOVED***';
const CLIENT_SECRET = '***REMOVED***';
const RESPONSE_TYPE = 'code';
const REDIRECT_URI = `http://localhost:${SERVER_PORT}/spotify/auth`;
const SCOPE = 'user-read-private user-read-email';
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
    req.session.accessToken =  res_token.data.access_token
    const res_profile = await axios.get(
      'https://api.spotify.com/v1/me',
      {
        headers: {
          'Authorization': `Bearer ${req.session.accessToken}`
        }
      }
    );
    req.session.userName = res_profile.data.display_name;
    req.session.profilePicURL = res_profile.data.images[0].url;
    res.redirect(`http://localhost:${CLIENT_PORT}`);
  }
});

router.get('/user', (req, res) => {
  if(req.session.accessToken) {
    res.status(200).send({
      userName: req.session.userName,
      profilePicURL: req.session.profilePicURL
    });
  }
  else {
    res.status(400).send({
      error: 'Session inactive!'
    })
  }
})

router.get('/top10', async (req, res) => {
  const spotifyAuthorization = await axios.post(
      'https://accounts.spotify.com/api/token',
      queryString.stringify({
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: REDIRECT_URI
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

  // const usersTop10TracksResponse = await axios.get(
  //   'https://api.spotify.com/v1/me/top/tracks?limit=10',
  //   {
  //     headers: {
  //       Authorization: `Bearer ${spotifyAuthorization.data.access_token}`,
  //     },
  //   }
  // );
  // const usersTop10Tracks = usersTop10TracksResponse.data.items;
  // const trackTitles = usersTop10Tracks.map((track) => track.name);
  // const trackList = `<ol>${trackTitles.map((title) => `<li>${title}</li>`).join('')}</ol>`;
  // res.send(`<p>Twoje top 10 utworów: ${trackList}</p>`);
  // return trackList;
});

module.exports = router;