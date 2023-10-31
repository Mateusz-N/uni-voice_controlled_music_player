const express = require('express')
const queryString = require('node:querystring');
const axios = require('axios');
const router = express.Router();

const CLIENT_ID = '***REMOVED***';
const CLIENT_SECRET = '***REMOVED***';
const RESPONSE_TYPE = 'code';
const REDIRECT_URI = 'http://localhost:3000/spotify/auth';
const SCOPE = 'user-top-read';

router.get("/", (req, res) => {
  res.send(
    `<a href='https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPE}'>Zaloguj się</a>`
  );
});

router.get('/auth', async (req, res) => {
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
        },
      }
    );

  const usersTop10TracksResponse = await axios.get(
    'https://api.spotify.com/v1/me/top/tracks?limit=10',
    {
      headers: {
        Authorization: `Bearer ${spotifyAuthorization.data.access_token}`,
      },
    }
  );
  const usersTop10Tracks = usersTop10TracksResponse.data.items;
  const trackTitles = usersTop10Tracks.map((track) => track.name);
  const trackList = `<ol>${trackTitles.map((title) => `<li>${title}</li>`).join('')}</ol>`;
  res.send(`<p>Twoje top 10 utworów: ${trackList}</p>`);
});

module.exports = router;